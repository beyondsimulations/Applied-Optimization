"""Native, game-styled illustrations for lecture 13, drawn from the game's class day (games/buses.js).

Same look as the game: time from left to right, the region from top to bottom, faint dashed line trips with
their names, bold bookings with a dot at each stop, the depot, one muted colour per bus.
Writes lectures/images/ao_bus-*.svg. Run from the course root after changing the game's class day:
    uv run python helpers/lecture-13-figures.py
The class day is read from `class` in games/buses.js; OPT below must be a best plan for it (checked).
"""
import json
import math
import re
from pathlib import Path

OUT = Path("lectures/images")
FONT = re.search(r'base64,([A-Za-z0-9+/=]+)', Path("lectures/images/ao_transport.svg").read_text()).group(1)
TEXT, MUTED, BG, PLAN = "#363D45", "#6c757d", "#FFFDFC", "#537E8F"
BUS = ["#B48E41", "#944E5A", "#768A56", "#C26A6A", "#62764E", "#9E7048", "#8E5F80", "#B27D76"]  # the game's bus colours
EM = 30  # one text size, like the game's view.em
SPEED = 240  # minutes to cross the whole region
T0, T1 = 360, 1320

# the class day, read from games/buses.js so the figures always show the game's day
GAME = Path("games/buses.js").read_text()
CLASS = GAME[GAME.index("    class: {"):GAME.index("    check: {")]
grab = lambda key: json.loads(re.search(rf"{key}: (\[\[.*?\]\])", CLASS, re.S).group(1))  # a nested array of numbers
LINES, TRIPS, BOOKS = grab("lines"), grab("trips"), grab("books")
DEPOT = float(re.search(r"depot: ([0-9.]+)", CLASS).group(1))
OPT = [[0, 3, 4, 7], [1, 2, 6], [5, 8]]  # HiGHS's three buses (the game's reveal), booking indices in the order of departure


def stops(k):
    line, start, dur = TRIPS[k]
    sp = LINES[line]
    return [(start + j / (len(sp) - 1) * dur, s) for j, s in enumerate(sp)]


def label(k):
    line = TRIPS[k][0]
    return "ABCDEF"[line] + str(sum(1 for j in range(k + 1) if TRIPS[j][0] == line))


def booking(i):
    k, a, b = BOOKS[i]
    st = stops(k)
    return dict(trip=k, a=a, b=b, dep=st[a][0], arr=st[b][0], frm=st[a][1], to=st[b][1], pts=st[a:b + 1])


B = [booking(i) for i in range(len(BOOKS))]
reach = lambda x, y: x["arr"] + SPEED * abs(x["to"] - y["frm"]) <= y["dep"]  # the lecture's connection condition, as in the game
clock = lambda m: f"{int(m) // 60}:{int(round(m)) % 60:02d}"


def fewest():  # the fewest buses: bookings minus the most links (a bipartite matching)
    prev = [-1] * len(B)

    def augment(a, seen):
        for b in range(len(B)):
            if b not in seen and reach(B[a], B[b]):
                seen.add(b)
                if prev[b] < 0 or augment(prev[b], seen):
                    prev[b] = a
                    return True
        return False
    return len(B) - sum(augment(a, set()) for a in range(len(B)))


assert sorted(i for t in OPT for i in t) == list(range(len(B))), "OPT must serve every booking once"
assert all(reach(B[t[n]], B[t[n + 1]]) for t in OPT for n in range(len(t) - 1)), "OPT has a link no bus makes in time"
assert len(OPT) == fewest(), f"OPT uses {len(OPT)} buses, the best plan {fewest()}"


class Board:
    """The game's board: time from left to right, the region (or a part of it) from top to bottom."""

    def __init__(self, t0=T0, t1=T1, s0=0.0, s1=1.0, w=1000, h=480, x0=150, hours=240):
        self.t0, self.t1, self.s0, self.s1, self.w, self.h = t0, t1, s0, s1, w, h
        self.x0, self.x1, self.y0, self.y1 = x0, w - 40, 40, h - 70
        self.parts = []
        for t in range(t0, t1 + 1, hours):
            self.text(clock(t), self.pos(t, s1)[0], h - 30, cls="muted")

    def pos(self, t, s):
        return (self.x0 + (t - self.t0) / (self.t1 - self.t0) * (self.x1 - self.x0),
                self.y0 + (s - self.s0) / (self.s1 - self.s0) * (self.y1 - self.y0))

    def add(self, s):
        self.parts.append(s)

    def text(self, s, x, y, anchor="middle", cls="", halo=False):
        c = " ".join(filter(None, [cls, "halo" if halo else ""]))
        self.add(f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}"{f" class={chr(34)}{c}{chr(34)}" if c else ""}>{s}</text>')

    def line(self, pts, color, width, opacity=1.0, dash=None, cap="round"):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="none" stroke="{color}" '
                 f'stroke-width="{width:.1f}" stroke-opacity="{opacity}" stroke-linecap="{cap}" stroke-linejoin="round"{d}/>')

    def trip(self, k, named=True, color=MUTED, opacity=0.45):  # a line trip: faint and dashed, named at its first stop
        pts = [self.pos(t, s) for t, s in stops(k)]
        self.line(pts, color, 0.1 * EM, opacity, f"{0.3 * EM:.0f} {0.3 * EM:.0f}")
        if named:
            x, y = pts[0]
            self.text(label(k), x, y - 1.0 * EM, cls="muted", halo=True)

    def band(self, pts):  # where a bus drives: a broad translucent band
        self.line([self.pos(t, s) for t, s in pts], PLAN, 0.9 * EM, 0.3)

    def book(self, i, color=PLAN, width=0.4):  # a booking: bold, with a dot at each of its stops
        pts = [self.pos(t, s) for t, s in B[i]["pts"]]
        self.line(pts, color, width * EM)
        for x, y in pts:
            self.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{0.38 * EM:.1f}" fill="{color}"/>')

    def drive(self, a, b, color):  # an empty drive, dashed
        self.line([a, b], color, 0.12 * EM, 0.7, f"{0.3 * EM:.0f} {0.3 * EM:.0f}")

    def depot(self):
        x, y = 60, self.pos(T0, DEPOT)[1]
        self.add(f'<rect x="{x - 0.6 * EM:.1f}" y="{y - 0.6 * EM:.1f}" width="{1.2 * EM:.1f}" height="{1.2 * EM:.1f}" fill="{TEXT}"/>')
        self.text("Depot", x, y + 1.5 * EM)
        return (x, y)

    def svg(self, title):
        style = (f"@font-face {{ font-family: 'Reddit Sans'; font-style: normal; font-weight: 400; src: url(\"data:font/woff2;base64,{FONT}\") format(\"woff2\"); }}\n"
                 f"text {{ font-family: 'Reddit Sans', -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: {EM}px; dominant-baseline: central; fill: {TEXT}; }}\n"
                 f".muted {{ fill: {MUTED}; }}\n.plan {{ fill: {PLAN}; }}\n"
                 f".halo {{ paint-order: stroke; stroke: {BG}; stroke-width: 8px; stroke-linejoin: round; }}")
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" role="img">\n'
                f"<title>{title}</title>\n<style>\n{style}\n</style>\n"
                f'<rect width="{self.w}" height="{self.h}" fill="{BG}"/>\n'  # opaque, so a figure stacked on another covers it
                + "\n".join(self.parts) + "\n</svg>\n")


def save(name, board, title):
    (OUT / f"ao_bus-{name}.svg").write_text(board.svg(title))


booked = sorted({b["trip"] for b in B})

# 1 One region, one day: the line trips, one of them picked out.
b = Board()
for k in range(len(TRIPS)):
    if k != 6: b.trip(k, opacity=0.7)
pts = [b.pos(t, s) for t, s in stops(6)]
b.line(pts, PLAN, 0.3 * EM)
for x, y in pts: b.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{0.3 * EM:.1f}" fill="{PLAN}"/>')
b.text("line trip D1", pts[0][0], pts[0][1] - 1.0 * EM, cls="plan", halo=True)
save("day", b, "Six bus lines, each in its own part of the region, over the day from 6:00 to 22:00: twelve line trips, "
     "named by line and number. Line trip D1, from 13:50 to 15:30 with five stops, is picked out.")

# 2 Service scopes: shaded bands are where buses drive, dark stretches are the bookings.
for scope in ["s1", "s2", "s3"]:
    b = Board()
    for k in range(len(TRIPS)):
        b.trip(k)
        if scope == "s1" or (scope == "s2" and k in booked): b.band(stops(k))
    if scope == "s3":
        for bk in B: b.band(bk["pts"])
    for i in range(len(B)): b.book(i, TEXT, 0.3)
    what = {"s1": "all twelve line trips run in full", "s2": "the nine line trips with a booking run in full",
            "s3": "only the nine booked stretches run"}[scope]
    save(f"scope_{scope}", b, f"Service scope {scope.upper()} on the class day: {what}. Shaded bands show where buses drive; dark stretches are the nine bookings.")

# 3 The connection condition: the tightest connection of the best plan, with the wedge of where the bus can still get in time.
pairs = [(t[n], t[n + 1]) for t in OPT for n in range(len(t) - 1)]
a, c = min(pairs, key=lambda q: B[q[1]]["dep"] - B[q[0]]["arr"] - SPEED * abs(B[q[0]]["to"] - B[q[1]]["frm"]))
A, Cb = B[a], B[c]
lo, hi = max(T0, A["dep"] - 60), min(T1, Cb["arr"] + 120)
b = Board(t0=int(lo // 60 * 60), t1=int(-(-hi // 60) * 60), hours=60)
cone = [b.pos(min(b.t1, A["arr"] + SPEED * abs(s / 100 - A["to"])), s / 100) for s in range(0, 101)]
cone += [b.pos(b.t1, 1), b.pos(b.t1, 0)]
b.add(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in cone)}" fill="{PLAN}" fill-opacity="0.12"/>')
for k in range(len(TRIPS)):
    if b.t0 <= stops(k)[0][0] <= b.t1 or b.t0 <= stops(k)[-1][0] <= b.t1: b.trip(k, named=k in (A["trip"], Cb["trip"]))
b.book(a); b.book(c)
pa, pc = b.pos(A["arr"], A["to"]), b.pos(Cb["dep"], Cb["frm"])
b.drive(pa, pc, PLAN)
d = round(SPEED * abs(A["to"] - Cb["frm"]))
b.text(f"free at {clock(A['arr'])}", pa[0] + 8, pa[1] - 1.2 * EM, anchor="start", halo=True)
b.text(f"drives {d} min", (pa[0] + pc[0]) / 2 - 16, (pa[1] + pc[1]) / 2 + 16, anchor="end", cls="plan", halo=True)
b.text(f"leaves at {clock(Cb['dep'])}", pc[0] + 10, pc[1] + 1.2 * EM, anchor="start", halo=True)
save("connection", b, f"The booking on {label(A['trip'])} ends at {clock(A['arr'])}. The shaded wedge is where its bus can still get in time. "
     f"The booking on {label(Cb['trip'])} leaves at {clock(Cb['dep'])}, {d} minutes of driving away: the bus makes it.")
print("connection:", label(A["trip"]), clock(A["arr"]), "->", label(Cb["trip"]), clock(Cb["dep"]), f"drive {d}")

# 4 The graph for three bookings: two can't follow each other, both can go on to the third.
trio = next((x, y, z) for x in range(len(B)) for y in range(x + 1, len(B)) for z in range(len(B))
            if z not in (x, y) and reach(B[x], B[z]) and reach(B[y], B[z]) and not reach(B[x], B[y]) and not reach(B[y], B[x]))
G = [B[i] for i in trio]
lo, hi = min(g["dep"] for g in G) - 60, max(g["arr"] for g in G) + 30
ends = [v for g in G for v in (g["frm"], g["to"])] + [DEPOT]
s0, s1 = max(0, min(ends) - 0.06), min(1, max(ends) + 0.06)


def sub(l, s):  # s with the trip as superscript and the stop as subscript
    return f's<tspan dy="-13" font-size="21">{l}</tspan><tspan dx="-11" dy="24" font-size="21">{s}</tspan>'


for name, arcs in [("graph_nodes", False), ("graph_arcs", True)]:
    b = Board(t0=int(lo // 60 * 60), t1=int(-(-hi // 60) * 60), s0=s0, s1=s1, x0=230, hours=60)
    dx, dy = 110, b.pos(T0, DEPOT)[1]
    nodes = [(l, b.pos(g["dep"], g["frm"]), b.pos(g["arr"], g["to"])) for l, g in enumerate(G, 1)]
    if arcs:
        for l, s_, m in nodes:
            b.line([(dx + 26, dy), s_], MUTED, 3, 1, "3 7")
            b.line([m, (dx + 26, dy)], MUTED, 3, 1, "3 7")
        for l, s_, m in nodes:
            b.line([s_, m], PLAN, 0.3 * EM)
        for x_ in (0, 1):
            b.line([nodes[x_][2], nodes[2][1]], PLAN, 0.2 * EM, 1, f"{0.5 * EM:.0f} {0.35 * EM:.0f}", cap="butt")
    b.add(f'<rect x="{dx - 26}" y="{dy - 26:.1f}" width="52" height="52" fill="{TEXT}"/>')
    b.add(f'<text x="{dx}" y="{dy:.1f}" text-anchor="middle" style="fill: {BG}">D</text>')
    for l, s_, m in nodes:
        for (x, y), st, up in [(s_, "1", True), (m, "m", False)]:
            b.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="11" fill="{BG}" stroke="{TEXT}" stroke-width="4"/>')
            b.add(f'<text x="{x:.1f}" y="{y + (-34 if up else 34):.1f}" text-anchor="middle" class="halo">{sub(l, st)}</text>')
    names = ", ".join(f"{n} the booking on {label(g['trip'])} at {clock(g['dep'])}" for n, g in enumerate(G, 1))
    what = (f"the depot D and the first and last stop of three bookings: {names}") if not arcs else (
        "the same nodes with dotted depot arcs, three solid trip arcs, and two dashed connection arcs from the ends of "
        "bookings 1 and 2 to the start of booking 3; bookings 1 and 2 can't follow each other, so no arc joins them")
    save(name, b, f"Graph for three bookings of the class day: {what}.")
print("trio:", [(label(g["trip"]), clock(g["dep"]), clock(g["arr"])) for g in G])

# 5 The best plan for the day: three buses, as the game shows it.
b = Board()
dep = b.depot()
for k in range(len(TRIPS)): b.trip(k)
for n, tour in enumerate(OPT):
    pts = [dep]
    for i in tour: pts += [b.pos(B[i]["dep"], B[i]["frm"]), b.pos(B[i]["arr"], B[i]["to"])]
    pts.append(dep)
    for j in range(0, len(pts), 2): b.drive(pts[j], pts[j + 1], BUS[n])
for n, tour in enumerate(OPT):
    for i in tour: b.book(i, BUS[n])
save("tours", b, "The best plan for the class day: three buses, each in its own colour, with dashed empty drives from the depot, "
     "between their bookings and back. " + "; ".join(f"bus {n + 1}: " + ", ".join(f"{label(B[i]['trip'])} at {clock(B[i]['dep'])}" for i in t) for n, t in enumerate(OPT)))

# 6 Overlapping bookings on one trip are merged into one stretch (trip E2, six stops).
k = 3
st = stops(k)
lo, hi = st[0][0] - 20, st[-1][0] + 20
for name, parts in [("overlap", [(0, 2, PLAN, -1), (1, 3, TEXT, 1)]), ("merged", [(0, 3, PLAN, 0)])]:
    b = Board(t0=int(lo // 60 * 60), t1=int(-(-hi // 60) * 60), s0=0.42, s1=0.72, hours=60)
    b.trip(k, named=False)
    for a_, c_, color, side in parts:
        pts = [b.pos(t, s) for t, s in st[a_:c_ + 1]]
        (x1, y1), (x2, y2) = pts[0], pts[-1]
        nx, ny = -(y2 - y1), x2 - x1
        f = 10 * side / math.hypot(nx, ny)  # apart across the trip
        pts = [(x + f * nx, y + f * ny) for x, y in pts]
        b.line(pts, color, 0.4 * EM)
        for x, y in pts: b.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{0.38 * EM:.1f}" fill="{color}"/>')
        txt = "one stretch, one bus" if name == "merged" else ("booking 1" if side < 0 else "booking 2")
        if side < 0: b.text(txt, pts[0][0] - 14, pts[0][1] + 1.0 * EM, anchor="end", cls="plan", halo=True)  # booking 1: below-left of its start
        else: b.text(txt, pts[-1][0] + 14, pts[-1][1] + 1.0 * EM, anchor="start", cls="plan" if color == PLAN else "", halo=True)
    what = ("two bookings on trip E2 overlap: one from its first to its third stop, one from its second to its fourth"
            if name == "overlap" else "after merging, one stretch from the first to the fourth stop of trip E2 serves both")
    save(name, b, f"{what[0].upper()}{what[1:]}.")
print("written:", sorted(p.name for p in OUT.glob("ao_bus-*.svg")))
