/*
 Highcharts JS v7.1.3 (2019-08-14)

 Annotations module

 (c) 2009-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (f) { "object" === typeof module && module.exports ? (f["default"] = f, module.exports = f) : "function" === typeof define && define.amd ? define("highcharts/modules/annotations-advanced", ["highcharts"], function (v) { f(v); f.Highcharts = v; return f }) : f("undefined" !== typeof Highcharts ? Highcharts : void 0) })(function (f) {
    function v(e, k, f, m) { e.hasOwnProperty(k) || (e[k] = m.apply(null, f)) } f = f ? f._modules : {}; v(f, "annotations/eventEmitterMixin.js", [f["parts/Globals.js"], f["parts/Utilities.js"]], function (e, k) {
        var f = k.objectEach,
        m = e.fireEvent; return {
            addEvents: function () {
                var c = this; e.addEvent(c.graphic.element, "mousedown", function (d) { c.onMouseDown(d) }); f(c.options.events, function (d, a) { var b = function (b) { "click" === a && c.cancelClick || d.call(c, c.chart.pointer.normalize(b), c.target) }; if (-1 === e.inArray(a, c.nonDOMEvents || [])) c.graphic.on(a, b); else e.addEvent(c, a, b) }); c.options.draggable && (e.addEvent(c, "drag", c.onDrag), c.graphic.renderer.styledMode || c.graphic.css({ cursor: { x: "ew-resize", y: "ns-resize", xy: "move" }[c.options.draggable] }));
                c.isUpdating || m(c, "add")
            }, removeDocEvents: function () { this.removeDrag && (this.removeDrag = this.removeDrag()); this.removeMouseUp && (this.removeMouseUp = this.removeMouseUp()) }, onMouseDown: function (c) {
                var d = this, a = d.chart.pointer; c.preventDefault && c.preventDefault(); if (2 !== c.button) {
                    c = a.normalize(c); var b = c.chartX; var g = c.chartY; d.cancelClick = !1; d.removeDrag = e.addEvent(e.doc, "mousemove", function (p) { d.hasDragged = !0; p = a.normalize(p); p.prevChartX = b; p.prevChartY = g; m(d, "drag", p); b = p.chartX; g = p.chartY }); d.removeMouseUp =
                        e.addEvent(e.doc, "mouseup", function (b) { d.cancelClick = d.hasDragged; d.hasDragged = !1; m(e.pick(d.target, d), "afterUpdate"); d.onMouseUp(b) })
                }
            }, onMouseUp: function () { var c = this.chart, d = this.target || this, a = c.options.annotations; c = c.annotations.indexOf(d); this.removeDocEvents(); a[c] = d.options }, onDrag: function (c) {
                if (this.chart.isInsidePlot(c.chartX - this.chart.plotLeft, c.chartY - this.chart.plotTop)) {
                    var d = this.mouseMoveToTranslation(c); "x" === this.options.draggable && (d.y = 0); "y" === this.options.draggable && (d.x = 0);
                    this.points.length ? this.translate(d.x, d.y) : (this.shapes.forEach(function (a) { a.translate(d.x, d.y) }), this.labels.forEach(function (a) { a.translate(d.x, d.y) })); this.redraw(!1)
                }
            }, mouseMoveToRadians: function (c, d, a) { var b = c.prevChartY - a, g = c.prevChartX - d; a = c.chartY - a; c = c.chartX - d; this.chart.inverted && (d = g, g = b, b = d, d = c, c = a, a = d); return Math.atan2(a, c) - Math.atan2(b, g) }, mouseMoveToTranslation: function (c) { var d = c.chartX - c.prevChartX; c = c.chartY - c.prevChartY; if (this.chart.inverted) { var a = c; c = d; d = a } return { x: d, y: c } },
            mouseMoveToScale: function (c, d, a) { d = (c.chartX - d || 1) / (c.prevChartX - d || 1); c = (c.chartY - a || 1) / (c.prevChartY - a || 1); this.chart.inverted && (a = c, c = d, d = a); return { x: d, y: c } }, destroy: function () { this.removeDocEvents(); e.removeEvent(this); this.hcEvents = null }
        }
    }); v(f, "annotations/ControlPoint.js", [f["parts/Globals.js"], f["annotations/eventEmitterMixin.js"]], function (e, k) {
        function f(k, c, d, a) { this.chart = k; this.target = c; this.options = d; this.index = e.pick(d.index, a) } e.extend(f.prototype, k); f.prototype.nonDOMEvents = ["drag"];
        f.prototype.setVisibility = function (e) { this.graphic.attr("visibility", e ? "visible" : "hidden"); this.options.visible = e }; f.prototype.render = function () { var e = this.chart, c = this.options; this.graphic = e.renderer.symbol(c.symbol, 0, 0, c.width, c.height).add(e.controlPointsGroup).css(c.style); this.setVisibility(c.visible); this.addEvents() }; f.prototype.redraw = function (e) { this.graphic[e ? "animate" : "attr"](this.options.positioner.call(this, this.target)) }; f.prototype.destroy = function () {
            k.destroy.call(this); this.graphic &&
                (this.graphic = this.graphic.destroy()); this.options = this.target = this.chart = null
        }; f.prototype.update = function (k) { var c = this.chart, d = this.target, a = this.index; k = e.merge(!0, this.options, k); this.destroy(); this.constructor(c, d, k, a); this.render(c.controlPointsGroup); this.redraw() }; return f
    }); v(f, "annotations/MockPoint.js", [f["parts/Globals.js"], f["parts/Utilities.js"]], function (e, k) {
        function f(c, d, a) {
        this.series = { visible: !0, chart: c, getPlotBox: e.Series.prototype.getPlotBox }; this.target = d || null; this.options =
            a; this.applyOptions(this.getOptions())
        } var m = k.defined; f.fromPoint = function (c) { return new f(c.series.chart, null, { x: c.x, y: c.y, xAxis: c.series.xAxis, yAxis: c.series.yAxis }) }; f.pointToPixels = function (c, d) { var a = c.series, b = a.chart, g = c.plotX, p = c.plotY; b.inverted && (c.mock ? (g = c.plotY, p = c.plotX) : (g = b.plotWidth - c.plotY, p = b.plotHeight - c.plotX)); a && !d && (c = a.getPlotBox(), g += c.translateX, p += c.translateY); return { x: g, y: p } }; f.pointToOptions = function (c) { return { x: c.x, y: c.y, xAxis: c.series.xAxis, yAxis: c.series.yAxis } };
        e.extend(f.prototype, {
            mock: !0, hasDynamicOptions: function () { return "function" === typeof this.options }, getOptions: function () { return this.hasDynamicOptions() ? this.options(this.target) : this.options }, applyOptions: function (c) { this.command = c.command; this.setAxis(c, "x"); this.setAxis(c, "y"); this.refresh() }, setAxis: function (c, d) { d += "Axis"; c = c[d]; var a = this.series.chart; this.series[d] = c instanceof e.Axis ? c : m(c) ? a[d][c] || a.get(c) : null }, toAnchor: function () {
                var c = [this.plotX, this.plotY, 0, 0]; this.series.chart.inverted &&
                    (c[0] = this.plotY, c[1] = this.plotX); return c
            }, getLabelConfig: function () { return { x: this.x, y: this.y, point: this } }, isInsidePane: function () { var c = this.plotX, d = this.plotY, a = this.series.xAxis, b = this.series.yAxis, g = !0; a && (g = m(c) && 0 <= c && c <= a.len); b && (g = g && m(d) && 0 <= d && d <= b.len); return g }, refresh: function () {
                var c = this.series, d = c.xAxis; c = c.yAxis; var a = this.getOptions(); d ? (this.x = a.x, this.plotX = d.toPixels(a.x, !0)) : (this.x = null, this.plotX = a.x); c ? (this.y = a.y, this.plotY = c.toPixels(a.y, !0)) : (this.y = null, this.plotY = a.y);
                this.isInside = this.isInsidePane()
            }, translate: function (c, d, a, b) { this.hasDynamicOptions() || (this.plotX += a, this.plotY += b, this.refreshOptions()) }, scale: function (c, d, a, b) { if (!this.hasDynamicOptions()) { var g = this.plotY * b; this.plotX = (1 - a) * c + this.plotX * a; this.plotY = (1 - b) * d + g; this.refreshOptions() } }, rotate: function (c, d, a) { if (!this.hasDynamicOptions()) { var b = Math.cos(a); a = Math.sin(a); var g = this.plotX, p = this.plotY; g -= c; p -= d; this.plotX = g * b - p * a + c; this.plotY = g * a + p * b + d; this.refreshOptions() } }, refreshOptions: function () {
                var c =
                    this.series, d = c.xAxis; c = c.yAxis; this.x = this.options.x = d ? this.options.x = d.toValue(this.plotX, !0) : this.plotX; this.y = this.options.y = c ? c.toValue(this.plotY, !0) : this.plotY
            }
        }); return f
    }); v(f, "annotations/controllable/controllableMixin.js", [f["parts/Globals.js"], f["parts/Utilities.js"], f["annotations/ControlPoint.js"], f["annotations/MockPoint.js"]], function (e, k, f, m) {
        var c = k.isObject, d = k.isString, a = k.splat; return {
            init: function (b, g, a) {
            this.annotation = b; this.chart = b.chart; this.options = g; this.points = []; this.controlPoints =
                []; this.index = a; this.linkPoints(); this.addControlPoints()
            }, attr: function () { this.graphic.attr.apply(this.graphic, arguments) }, getPointsOptions: function () { var b = this.options; return b.points || b.point && a(b.point) }, attrsFromOptions: function (b) { var a = this.constructor.attrsMap, p = {}, c, l = this.chart.styledMode; for (c in b) { var h = a[c]; !h || l && -1 !== ["fill", "stroke", "stroke-width"].indexOf(h) || (p[h] = b[c]) } return p }, anchor: function (b) {
                var a = b.series.getPlotBox(); b = b.mock ? b.toAnchor() : e.Tooltip.prototype.getAnchor.call({ chart: b.series.chart },
                    b); b = { x: b[0] + (this.options.x || 0), y: b[1] + (this.options.y || 0), height: b[2] || 0, width: b[3] || 0 }; return { relativePosition: b, absolutePosition: e.merge(b, { x: b.x + a.translateX, y: b.y + a.translateY }) }
            }, point: function (b, a) { if (b && b.series) return b; a && null !== a.series || (c(b) ? a = new m(this.chart, this, b) : d(b) ? a = this.chart.get(b) || null : "function" === typeof b && (a = b.call(a, this), a = a.series ? a : new m(this.chart, this, b))); return a }, linkPoints: function () {
                var b = this.getPointsOptions(), a = this.points, c = b && b.length || 0, d; for (d = 0; d < c; d++) {
                    var l =
                        this.point(b[d], a[d]); if (!l) { a.length = 0; return } l.mock && l.refresh(); a[d] = l
                } return a
            }, addControlPoints: function () { var b = this.options.controlPoints; (b || []).forEach(function (a, c) { a = e.merge(this.options.controlPointOptions, a); a.index || (a.index = c); b[c] = a; this.controlPoints.push(new f(this.chart, this, a)) }, this) }, shouldBeDrawn: function () { return !!this.points.length }, render: function () { this.controlPoints.forEach(function (b) { b.render() }) }, redraw: function (b) { this.controlPoints.forEach(function (a) { a.redraw(b) }) },
            transform: function (b, a, c, d, l) { if (this.chart.inverted) { var g = a; a = c; c = g } this.points.forEach(function (g, p) { this.transformPoint(b, a, c, d, l, p) }, this) }, transformPoint: function (b, a, c, d, l, h) { var g = this.points[h]; g.mock || (g = this.points[h] = m.fromPoint(g)); g[b](a, c, d, l) }, translate: function (b, a) { this.transform("translate", null, null, b, a) }, translatePoint: function (b, a, c) { this.transformPoint("translate", null, null, b, a, c) }, translateShape: function (b, a) {
                var g = this.annotation.chart, c = this.annotation.userOptions, l = g.annotations.indexOf(this.annotation);
                g = g.options.annotations[l]; this.translatePoint(b, a, 0); g[this.collection][this.index].point = this.options.point; c[this.collection][this.index].point = this.options.point
            }, rotate: function (b, a, c) { this.transform("rotate", b, a, c) }, scale: function (b, a, c, d) { this.transform("scale", b, a, c, d) }, setControlPointsVisibility: function (b) { this.controlPoints.forEach(function (a) { a.setVisibility(b) }) }, destroy: function () {
            this.graphic && (this.graphic = this.graphic.destroy()); this.tracker && (this.tracker = this.tracker.destroy());
                this.controlPoints.forEach(function (b) { b.destroy() }); this.options = this.controlPoints = this.points = this.chart = null; this.annotation && (this.annotation = null)
            }, update: function (b) { var a = this.annotation; b = e.merge(!0, this.options, b); var c = this.graphic.parentGroup; this.destroy(); this.constructor(a, b); this.render(c); this.redraw() }
        }
    }); v(f, "annotations/controllable/markerMixin.js", [f["parts/Globals.js"], f["parts/Utilities.js"]], function (e, k) {
        var f = k.defined, m = k.objectEach, c = k.splat, d = {
            arrow: {
                tagName: "marker",
                render: !1, id: "arrow", refY: 5, refX: 9, markerWidth: 10, markerHeight: 10, children: [{ tagName: "path", d: "M 0 0 L 10 5 L 0 10 Z", strokeWidth: 0 }]
            }, "reverse-arrow": { tagName: "marker", render: !1, id: "reverse-arrow", refY: 5, refX: 1, markerWidth: 10, markerHeight: 10, children: [{ tagName: "path", d: "M 0 5 L 10 0 L 10 10 Z", strokeWidth: 0 }] }
        }; e.SVGRenderer.prototype.addMarker = function (a, b) {
            var g = { id: a }, c = { stroke: b.color || "none", fill: b.color || "rgba(0, 0, 0, 0.75)" }; g.children = b.children.map(function (b) { return e.merge(c, b) }); b = this.definition(e.merge(!0,
                { markerWidth: 20, markerHeight: 20, refX: 0, refY: 0, orient: "auto" }, b, g)); b.id = a; return b
        }; k = function (a) { return function (b) { this.attr(a, "url(#" + b + ")") } }; k = {
            markerEndSetter: k("marker-end"), markerStartSetter: k("marker-start"), setItemMarkers: function (a) {
                var b = a.options, g = a.chart, c = g.options.defs, d = b.fill, l = f(d) && "none" !== d ? d : b.stroke;["markerStart", "markerEnd"].forEach(function (h) {
                    var d = b[h], p; if (d) {
                        for (p in c) { var q = c[p]; if (d === q.id && "marker" === q.tagName) { var r = q; break } } r && (d = a[h] = g.renderer.addMarker((b.id ||
                            e.uniqueKey()) + "-" + r.id, e.merge(r, { color: l })), a.attr(h, d.attr("id")))
                    }
                })
            }
        }; e.SVGRenderer.prototype.definition = function (a) { function b(a, d) { var l; c(a).forEach(function (a) { var c = g.createElement(a.tagName), h = {}; m(a, function (b, a) { "tagName" !== a && "children" !== a && "textContent" !== a && (h[a] = b) }); c.attr(h); c.add(d || g.defs); a.textContent && c.element.appendChild(e.doc.createTextNode(a.textContent)); b(a.children || [], c); l = c }); return l } var g = this; return b(a) }; e.addEvent(e.Chart, "afterGetContainer", function () {
            this.options.defs =
            e.merge(d, this.options.defs || {}); m(this.options.defs, function (a) { "marker" === a.tagName && !1 !== a.render && this.renderer.addMarker(a.id, a) }, this)
        }); return k
    }); v(f, "annotations/controllable/ControllablePath.js", [f["parts/Globals.js"], f["annotations/controllable/controllableMixin.js"], f["annotations/controllable/markerMixin.js"]], function (e, k, f) {
        function m(c, a, b) { this.init(c, a, b); this.collection = "shapes" } var c = "rgba(192,192,192," + (e.svg ? .0001 : .002) + ")"; m.attrsMap = {
            dashStyle: "dashstyle", strokeWidth: "stroke-width",
            stroke: "stroke", fill: "fill", zIndex: "zIndex"
        }; e.merge(!0, m.prototype, k, {
            type: "path", setMarkers: f.setItemMarkers, toD: function () {
                var c = this.options.d; if (c) return "function" === typeof c ? c.call(this) : c; var a = this.points, b = a.length, g = b, p = a[0], e = g && this.anchor(p).absolutePosition, l = 0, h = 2; for (c = e && ["M", e.x, e.y]; ++l < b && g;)p = a[l], g = p.command || "L", e = this.anchor(p).absolutePosition, "Z" === g ? c[++h] = g : (g !== a[l - 1].command && (c[++h] = g), c[++h] = e.x, c[++h] = e.y), g = p.series.visible; return g ? this.chart.renderer.crispLine(c,
                    this.graphic.strokeWidth()) : null
            }, shouldBeDrawn: function () { return k.shouldBeDrawn.call(this) || !!this.options.d }, render: function (d) {
                var a = this.options, b = this.attrsFromOptions(a); this.graphic = this.annotation.chart.renderer.path(["M", 0, 0]).attr(b).add(d); a.className && this.graphic.addClass(a.className); this.tracker = this.annotation.chart.renderer.path(["M", 0, 0]).addClass("highcharts-tracker-line").attr({ zIndex: 2 }).add(d); this.annotation.chart.styledMode || this.tracker.attr({
                    "stroke-linejoin": "round", stroke: c,
                    fill: c, "stroke-width": this.graphic.strokeWidth() + 2 * a.snap
                }); k.render.call(this); e.extend(this.graphic, { markerStartSetter: f.markerStartSetter, markerEndSetter: f.markerEndSetter }); this.setMarkers(this)
            }, redraw: function (c) { var a = this.toD(), b = c ? "animate" : "attr"; a ? (this.graphic[b]({ d: a }), this.tracker[b]({ d: a })) : (this.graphic.attr({ d: "M 0 -9000000000" }), this.tracker.attr({ d: "M 0 -9000000000" })); this.graphic.placed = this.tracker.placed = !!a; k.redraw.call(this, c) }
        }); return m
    }); v(f, "annotations/controllable/ControllableRect.js",
        [f["parts/Globals.js"], f["annotations/controllable/controllableMixin.js"], f["annotations/controllable/ControllablePath.js"]], function (e, k, f) {
            function m(c, d, a) { this.init(c, d, a); this.collection = "shapes" } m.attrsMap = e.merge(f.attrsMap, { width: "width", height: "height" }); e.merge(!0, m.prototype, k, {
                type: "rect", translate: k.translateShape, render: function (c) { var d = this.attrsFromOptions(this.options); this.graphic = this.annotation.chart.renderer.rect(0, -9E9, 0, 0).attr(d).add(c); k.render.call(this) }, redraw: function (c) {
                    var d =
                        this.anchor(this.points[0]).absolutePosition; if (d) this.graphic[c ? "animate" : "attr"]({ x: d.x, y: d.y, width: this.options.width, height: this.options.height }); else this.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!d; k.redraw.call(this, c)
                }
            }); return m
        }); v(f, "annotations/controllable/ControllableCircle.js", [f["parts/Globals.js"], f["annotations/controllable/controllableMixin.js"], f["annotations/controllable/ControllablePath.js"]], function (e, k, f) {
            function m(c, d, a) { this.init(c, d, a); this.collection = "shapes" } m.attrsMap =
                e.merge(f.attrsMap, { r: "r" }); e.merge(!0, m.prototype, k, {
                    type: "circle", translate: k.translateShape, render: function (c) { var d = this.attrsFromOptions(this.options); this.graphic = this.annotation.chart.renderer.circle(0, -9E9, 0).attr(d).add(c); k.render.call(this) }, redraw: function (c) { var d = this.anchor(this.points[0]).absolutePosition; if (d) this.graphic[c ? "animate" : "attr"]({ x: d.x, y: d.y, r: this.options.r }); else this.graphic.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!d; k.redraw.call(this, c) }, setRadius: function (c) {
                        this.options.r =
                        c
                    }
                }); return m
        }); v(f, "annotations/controllable/ControllableLabel.js", [f["parts/Globals.js"], f["parts/Utilities.js"], f["annotations/controllable/controllableMixin.js"], f["annotations/MockPoint.js"]], function (e, k, f, m) {
            function c(a, b, c) { this.init(a, b, c); this.collection = "labels" } var d = k.isNumber; c.shapesWithoutBackground = ["connector"]; c.alignedPosition = function (a, b) {
                var c = a.align, p = a.verticalAlign, d = (b.x || 0) + (a.x || 0), l = (b.y || 0) + (a.y || 0), h, e; "right" === c ? h = 1 : "center" === c && (h = 2); h && (d += (b.width - (a.width ||
                    0)) / h); "bottom" === p ? e = 1 : "middle" === p && (e = 2); e && (l += (b.height - (a.height || 0)) / e); return { x: Math.round(d), y: Math.round(l) }
            }; c.justifiedOptions = function (a, b, c, d) {
                var g = c.align, l = c.verticalAlign, h = b.box ? 0 : b.padding || 0, p = b.getBBox(); b = { align: g, verticalAlign: l, x: c.x, y: c.y, width: b.width, height: b.height }; c = d.x - a.plotLeft; var n = d.y - a.plotTop; d = c + h; 0 > d && ("right" === g ? b.align = "left" : b.x = -d); d = c + p.width - h; d > a.plotWidth && ("left" === g ? b.align = "right" : b.x = a.plotWidth - d); d = n + h; 0 > d && ("bottom" === l ? b.verticalAlign = "top" :
                    b.y = -d); d = n + p.height - h; d > a.plotHeight && ("top" === l ? b.verticalAlign = "bottom" : b.y = a.plotHeight - d); return b
            }; c.attrsMap = { backgroundColor: "fill", borderColor: "stroke", borderWidth: "stroke-width", zIndex: "zIndex", borderRadius: "r", padding: "padding" }; e.merge(!0, c.prototype, f, {
                translatePoint: function (a, b) { f.translatePoint.call(this, a, b, 0) }, translate: function (a, b) {
                    var c = this.annotation.chart, d = this.annotation.userOptions, e = c.annotations.indexOf(this.annotation); e = c.options.annotations[e]; c.inverted && (c = a, a = b,
                        b = c); this.options.x += a; this.options.y += b; e[this.collection][this.index].x = this.options.x; e[this.collection][this.index].y = this.options.y; d[this.collection][this.index].x = this.options.x; d[this.collection][this.index].y = this.options.y
                }, render: function (a) {
                    var b = this.options, g = this.attrsFromOptions(b), d = b.style; this.graphic = this.annotation.chart.renderer.label("", 0, -9999, b.shape, null, null, b.useHTML, null, "annotation-label").attr(g).add(a); this.annotation.chart.styledMode || ("contrast" === d.color && (d.color =
                        this.annotation.chart.renderer.getContrast(-1 < c.shapesWithoutBackground.indexOf(b.shape) ? "#FFFFFF" : b.backgroundColor)), this.graphic.css(b.style).shadow(b.shadow)); b.className && this.graphic.addClass(b.className); this.graphic.labelrank = b.labelrank; f.render.call(this)
                }, redraw: function (a) {
                    var b = this.options, c = this.text || b.format || b.text, d = this.graphic, q = this.points[0]; d.attr({ text: c ? e.format(c, q.getLabelConfig(), this.annotation.chart.time) : b.formatter.call(q, this) }); b = this.anchor(q); (c = this.position(b)) ?
                        (d.alignAttr = c, c.anchorX = b.absolutePosition.x, c.anchorY = b.absolutePosition.y, d[a ? "animate" : "attr"](c)) : d.attr({ x: 0, y: -9999 }); d.placed = !!c; f.redraw.call(this, a)
                }, anchor: function () { var a = f.anchor.apply(this, arguments), b = this.options.x || 0, c = this.options.y || 0; a.absolutePosition.x -= b; a.absolutePosition.y -= c; a.relativePosition.x -= b; a.relativePosition.y -= c; return a }, position: function (a) {
                    var b = this.graphic, g = this.annotation.chart, d = this.points[0], q = this.options, l = a.absolutePosition, h = a.relativePosition; if (a =
                        d.series.visible && m.prototype.isInsidePane.call(d)) {
                            if (q.distance) var k = e.Tooltip.prototype.getPosition.call({ chart: g, distance: e.pick(q.distance, 16) }, b.width, b.height, { plotX: h.x, plotY: h.y, negative: d.negative, ttBelow: d.ttBelow, h: h.height || h.width }); else q.positioner ? k = q.positioner.call(this) : (d = { x: l.x, y: l.y, width: 0, height: 0 }, k = c.alignedPosition(e.extend(q, { width: b.width, height: b.height }), d), "justify" === this.options.overflow && (k = c.alignedPosition(c.justifiedOptions(g, b, q, k), d))); q.crop && (q = k.x - g.plotLeft,
                                d = k.y - g.plotTop, a = g.isInsidePlot(q, d) && g.isInsidePlot(q + b.width, d + b.height))
                    } return a ? k : null
                }
            }); e.SVGRenderer.prototype.symbols.connector = function (a, b, c, e, q) { var g = q && q.anchorX; q = q && q.anchorY; var h = c / 2; if (d(g) && d(q)) { var p = ["M", g, q]; var n = b - q; 0 > n && (n = -e - n); n < c && (h = g < a + c / 2 ? n : c - n); q > b + e ? p.push("L", a + h, b + e) : q < b ? p.push("L", a + h, b) : g < a ? p.push("L", a, b + e / 2) : g > a + c && p.push("L", a + c, b + e / 2) } return p || [] }; return c
        }); v(f, "annotations/controllable/ControllableImage.js", [f["parts/Globals.js"], f["annotations/controllable/controllableMixin.js"],
        f["annotations/controllable/ControllableLabel.js"]], function (e, k, f) {
            function m(c, d, a) { this.init(c, d, a); this.collection = "shapes" } m.attrsMap = { width: "width", height: "height", zIndex: "zIndex" }; e.merge(!0, m.prototype, k, {
                type: "image", translate: k.translateShape, render: function (c) { var d = this.attrsFromOptions(this.options), a = this.options; this.graphic = this.annotation.chart.renderer.image(a.src, 0, -9E9, a.width, a.height).attr(d).add(c); this.graphic.width = a.width; this.graphic.height = a.height; k.render.call(this) },
                redraw: function (c) { var d = this.anchor(this.points[0]); if (d = f.prototype.position.call(this, d)) this.graphic[c ? "animate" : "attr"]({ x: d.x, y: d.y }); else this.graphic.attr({ x: 0, y: -9E9 }); this.graphic.placed = !!d; k.redraw.call(this, c) }
            }); return m
        }); v(f, "annotations/annotations.src.js", [f["parts/Globals.js"], f["parts/Utilities.js"], f["annotations/controllable/controllableMixin.js"], f["annotations/controllable/ControllableRect.js"], f["annotations/controllable/ControllableCircle.js"], f["annotations/controllable/ControllablePath.js"],
        f["annotations/controllable/ControllableImage.js"], f["annotations/controllable/ControllableLabel.js"], f["annotations/eventEmitterMixin.js"], f["annotations/MockPoint.js"], f["annotations/ControlPoint.js"]], function (e, k, f, m, c, d, a, b, g, p, q) {
            var l = k.defined, h = k.erase, w = k.splat, n = e.merge, u = e.addEvent, r = e.fireEvent, x = e.find, y = e.pick, z = e.reduce, A = e.destroyObjectProperties; k = e.Chart.prototype; var t = e.Annotation = function (b, a) {
            this.chart = b; this.points = []; this.controlPoints = []; this.coll = "annotations"; this.labels =
                []; this.shapes = []; this.options = a; this.userOptions = n(!0, {}, a); var c = this.getLabelsAndShapesOptions(this.userOptions, a); this.userOptions.labels = c.labels; this.userOptions.shapes = c.shapes; this.init(b, a)
            }; n(!0, t.prototype, f, g, {
                nonDOMEvents: ["add", "afterUpdate", "remove"], defaultOptions: {
                    visible: !0, draggable: "xy", labelOptions: {
                        align: "center", allowOverlap: !1, backgroundColor: "rgba(0, 0, 0, 0.75)", borderColor: "black", borderRadius: 3, borderWidth: 1, className: "", crop: !1, formatter: function () {
                            return l(this.y) ? this.y :
                                "Annotation label"
                        }, overflow: "justify", padding: 5, shadow: !1, shape: "callout", style: { fontSize: "11px", fontWeight: "normal", color: "contrast" }, useHTML: !1, verticalAlign: "bottom", x: 0, y: -16
                    }, shapeOptions: { stroke: "rgba(0, 0, 0, 0.75)", strokeWidth: 1, fill: "rgba(0, 0, 0, 0.75)", r: 0, snap: 2 }, controlPointOptions: { symbol: "circle", width: 10, height: 10, style: { stroke: "black", "stroke-width": 2, fill: "white" }, visible: !1, events: {} }, events: {}, zIndex: 6
                }, init: function () {
                    this.linkPoints(); this.addControlPoints(); this.addShapes();
                    this.addLabels(); this.addClipPaths(); this.setLabelCollector()
                }, getLabelsAndShapesOptions: function (b, a) { var c = {};["labels", "shapes"].forEach(function (g) { b[g] && (c[g] = w(a[g]).map(function (a, c) { return n(b[g][c], a) })) }); return c }, addShapes: function () { (this.options.shapes || []).forEach(this.initShape, this) }, addLabels: function () { (this.options.labels || []).forEach(this.initLabel, this) }, addClipPaths: function () { this.setClipAxes(); this.clipXAxis && this.clipYAxis && (this.clipRect = this.chart.renderer.clipRect(this.getClipBox())) },
                setClipAxes: function () { var b = this.chart.xAxis, a = this.chart.yAxis, c = z((this.options.labels || []).concat(this.options.shapes || []), function (c, g) { return [b[g && g.point && g.point.xAxis] || c[0], a[g && g.point && g.point.yAxis] || c[1]] }, []); this.clipXAxis = c[0]; this.clipYAxis = c[1] }, getClipBox: function () { return { x: this.clipXAxis.left, y: this.clipYAxis.top, width: this.clipXAxis.width, height: this.clipYAxis.height } }, setLabelCollector: function () {
                    var b = this; b.labelCollector = function () {
                        return b.labels.reduce(function (b, a) {
                            a.options.allowOverlap ||
                            b.push(a.graphic); return b
                        }, [])
                    }; b.chart.labelCollectors.push(b.labelCollector)
                }, setOptions: function (b) { this.options = n(this.defaultOptions, b) }, redraw: function (b) { this.linkPoints(); this.graphic || this.render(); this.clipRect && this.clipRect.animate(this.getClipBox()); this.redrawItems(this.shapes, b); this.redrawItems(this.labels, b); f.redraw.call(this, b) }, redrawItems: function (b, a) { for (var c = b.length; c--;)this.redrawItem(b[c], a) }, render: function () {
                    var b = this.chart.renderer; this.graphic = b.g("annotation").attr({
                        zIndex: this.options.zIndex,
                        visibility: this.options.visible ? "visible" : "hidden"
                    }).add(); this.shapesGroup = b.g("annotation-shapes").add(this.graphic).clip(this.chart.plotBoxClip); this.labelsGroup = b.g("annotation-labels").attr({ translateX: 0, translateY: 0 }).add(this.graphic); this.clipRect && this.graphic.clip(this.clipRect); this.addEvents(); f.render.call(this)
                }, setVisibility: function (b) { var a = this.options; b = y(b, !a.visible); this.graphic.attr("visibility", b ? "visible" : "hidden"); b || this.setControlPointsVisibility(!1); a.visible = b }, setControlPointsVisibility: function (b) {
                    var a =
                        function (a) { a.setControlPointsVisibility(b) }; f.setControlPointsVisibility.call(this, b); this.shapes.forEach(a); this.labels.forEach(a)
                }, destroy: function () { var b = this.chart, a = function (b) { b.destroy() }; this.labels.forEach(a); this.shapes.forEach(a); this.clipYAxis = this.clipXAxis = null; h(b.labelCollectors, this.labelCollector); g.destroy.call(this); f.destroy.call(this); A(this, b) }, remove: function () { return this.chart.removeAnnotation(this) }, update: function (b) {
                    var a = this.chart, c = this.getLabelsAndShapesOptions(this.userOptions,
                        b), g = a.annotations.indexOf(this); b = e.merge(!0, this.userOptions, b); b.labels = c.labels; b.shapes = c.shapes; this.destroy(); this.constructor(a, b); a.options.annotations[g] = b; this.isUpdating = !0; this.redraw(); this.isUpdating = !1; r(this, "afterUpdate")
                }, initShape: function (b, a) { b = n(this.options.shapeOptions, { controlPointOptions: this.options.controlPointOptions }, b); a = new t.shapesMap[b.type](this, b, a); a.itemType = "shape"; this.shapes.push(a); return a }, initLabel: function (a, c) {
                    a = n(this.options.labelOptions, { controlPointOptions: this.options.controlPointOptions },
                        a); c = new b(this, a, c); c.itemType = "label"; this.labels.push(c); return c
                }, redrawItem: function (b, a) { b.linkPoints(); b.shouldBeDrawn() ? (b.graphic || this.renderItem(b), b.redraw(e.pick(a, !0) && b.graphic.placed), b.points.length && this.adjustVisibility(b)) : this.destroyItem(b) }, adjustVisibility: function (b) { var a = !1, c = b.graphic; b.points.forEach(function (b) { !1 !== b.series.visible && !1 !== b.visible && (a = !0) }); a ? "hidden" === c.visibility && c.show() : c.hide() }, destroyItem: function (b) { h(this[b.itemType + "s"], b); b.destroy() }, renderItem: function (b) {
                    b.render("label" ===
                        b.itemType ? this.labelsGroup : this.shapesGroup)
                }
            }); t.shapesMap = { rect: m, circle: c, path: d, image: a }; t.types = {}; t.MockPoint = p; t.ControlPoint = q; e.extendAnnotation = function (b, a, c, g) { a = a || t; n(!0, b.prototype, a.prototype, c); b.prototype.defaultOptions = n(b.prototype.defaultOptions, g || {}) }; e.extend(k, {
                initAnnotation: function (b) { var a = t.types[b.type] || t; b = e.merge(a.prototype.defaultOptions, b); a = new a(this, b); this.annotations.push(a); return a }, addAnnotation: function (b, a) {
                    b = this.initAnnotation(b); this.options.annotations.push(b.options);
                    y(a, !0) && b.redraw(); return b
                }, removeAnnotation: function (b) { var a = this.annotations, c = "annotations" === b.coll ? b : x(a, function (a) { return a.options.id === b }); c && (r(c, "remove"), h(this.options.annotations, c.options), h(a, c), c.destroy()) }, drawAnnotations: function () { this.plotBoxClip.attr(this.plotBox); this.annotations.forEach(function (b) { b.redraw() }) }
            }); k.collectionsWithUpdate.push("annotations"); k.collectionsWithInit.annotations = [k.addAnnotation]; k.callbacks.push(function (b) {
            b.annotations = []; b.options.annotations ||
                (b.options.annotations = []); b.plotBoxClip = this.renderer.clipRect(this.plotBox); b.controlPointsGroup = b.renderer.g("control-points").attr({ zIndex: 99 }).clip(b.plotBoxClip).add(); b.options.annotations.forEach(function (a, c) { a = b.initAnnotation(a); b.options.annotations[c] = a.options }); b.drawAnnotations(); u(b, "redraw", b.drawAnnotations); u(b, "destroy", function () { b.plotBoxClip.destroy(); b.controlPointsGroup.destroy() })
            })
        }); v(f, "annotations/types/CrookedLine.js", [f["parts/Globals.js"]], function (e) {
            function k() {
                f.apply(this,
                    arguments)
            } var f = e.Annotation, m = f.MockPoint, c = f.ControlPoint; e.extendAnnotation(k, null, {
                setClipAxes: function () { this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis]; this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis] }, getPointsOptions: function () { var c = this.options.typeOptions; return c.points.map(function (a) { a.xAxis = c.xAxis; a.yAxis = c.yAxis; return a }) }, getControlPointsOptions: function () { return this.getPointsOptions() }, addControlPoints: function () {
                    this.getControlPointsOptions().forEach(function (d,
                        a) { a = new c(this.chart, this, e.merge(this.options.controlPointOptions, d.controlPoint), a); this.controlPoints.push(a); d.controlPoint = a.options }, this)
                }, addShapes: function () { var c = this.options.typeOptions, a = this.initShape(e.merge(c.line, { type: "path", points: this.points.map(function (b, a) { return function (b) { return b.annotation.points[a] } }) }), !1); c.line = a.options }
            }, {
                typeOptions: { xAxis: 0, yAxis: 0, line: { fill: "none" } }, controlPointOptions: {
                    positioner: function (c) {
                        var a = this.graphic; c = m.pointToPixels(c.points[this.index]);
                        return { x: c.x - a.width / 2, y: c.y - a.height / 2 }
                    }, events: { drag: function (c, a) { a.chart.isInsidePlot(c.chartX - a.chart.plotLeft, c.chartY - a.chart.plotTop) && (c = this.mouseMoveToTranslation(c), a.translatePoint(c.x, c.y, this.index), a.options.typeOptions.points[this.index].x = a.points[this.index].x, a.options.typeOptions.points[this.index].y = a.points[this.index].y, a.redraw(!1)) } }
                }
            }); return f.types.crookedLine = k
        }); v(f, "annotations/types/ElliottWave.js", [f["parts/Globals.js"]], function (e) {
            function f() { m.apply(this, arguments) }
            var t = e.Annotation, m = t.types.crookedLine; e.extendAnnotation(f, m, { addLabels: function () { this.getPointsOptions().forEach(function (c, d) { var a = this.initLabel(e.merge(c.label, { text: this.options.typeOptions.labels[d], point: function (b) { return b.annotation.points[d] } }), !1); c.label = a.options }, this) } }, { typeOptions: { labels: "(0) (A) (B) (C) (D) (E)".split(" "), line: { strokeWidth: 1 } }, labelOptions: { align: "center", allowOverlap: !0, crop: !0, overflow: "none", type: "rect", backgroundColor: "none", borderWidth: 0, y: -5 } }); return t.types.elliottWave =
                f
        }); v(f, "annotations/types/Tunnel.js", [f["parts/Globals.js"]], function (e) {
            function f() { m.apply(this, arguments) } var t = e.Annotation, m = t.types.crookedLine, c = t.ControlPoint, d = t.MockPoint; e.extendAnnotation(f, m, {
                getPointsOptions: function () { var a = m.prototype.getPointsOptions.call(this); a[2] = this.heightPointOptions(a[1]); a[3] = this.heightPointOptions(a[0]); return a }, getControlPointsOptions: function () { return this.getPointsOptions().slice(0, 2) }, heightPointOptions: function (a) {
                    a = e.merge(a); a.y += this.options.typeOptions.height;
                    return a
                }, addControlPoints: function () { m.prototype.addControlPoints.call(this); var a = this.options, b = new c(this.chart, this, e.merge(a.controlPointOptions, a.typeOptions.heightControlPoint), 2); this.controlPoints.push(b); a.typeOptions.heightControlPoint = b.options }, addShapes: function () { this.addLine(); this.addBackground() }, addLine: function () {
                    var a = this.initShape(e.merge(this.options.typeOptions.line, {
                        type: "path", points: [this.points[0], this.points[1], function (b) {
                            b = d.pointToOptions(b.annotation.points[2]);
                            b.command = "M"; return b
                        }, this.points[3]]
                    }), !1); this.options.typeOptions.line = a.options
                }, addBackground: function () { var a = this.initShape(e.merge(this.options.typeOptions.background, { type: "path", points: this.points.slice() })); this.options.typeOptions.background = a.options }, translateSide: function (a, b, c) { c = Number(c); var g = 0 === c ? 3 : 2; this.translatePoint(a, b, c); this.translatePoint(a, b, g) }, translateHeight: function (a) {
                    this.translatePoint(0, a, 2); this.translatePoint(0, a, 3); this.options.typeOptions.height = this.points[3].y -
                        this.points[0].y
                }
            }, {
                typeOptions: {
                    xAxis: 0, yAxis: 0, background: { fill: "rgba(130, 170, 255, 0.4)", strokeWidth: 0 }, line: { strokeWidth: 1 }, height: -2, heightControlPoint: {
                        positioner: function (a) { var b = d.pointToPixels(a.points[2]); a = d.pointToPixels(a.points[3]); var c = (b.x + a.x) / 2; return { x: c - this.graphic.width / 2, y: (a.y - b.y) / (a.x - b.x) * (c - b.x) + b.y - this.graphic.height / 2 } }, events: {
                            drag: function (a, b) {
                                b.chart.isInsidePlot(a.chartX - b.chart.plotLeft, a.chartY - b.chart.plotTop) && (b.translateHeight(this.mouseMoveToTranslation(a).y),
                                    b.redraw(!1))
                            }
                        }
                    }
                }, controlPointOptions: { events: { drag: function (a, b) { b.chart.isInsidePlot(a.chartX - b.chart.plotLeft, a.chartY - b.chart.plotTop) && (a = this.mouseMoveToTranslation(a), b.translateSide(a.x, a.y, this.index), b.redraw(!1)) } } }
            }); return t.types.tunnel = f
        }); v(f, "annotations/types/InfinityLine.js", [f["parts/Globals.js"]], function (e) {
            function f() { c.apply(this, arguments) } var t = e.Annotation, m = t.MockPoint, c = t.types.crookedLine; f.findEdgeCoordinate = function (a, b, c, d) {
                var g = "x" === c ? "y" : "x"; return (b[c] - a[c]) *
                    (d - a[g]) / (b[g] - a[g]) + a[c]
            }; f.findEdgePoint = function (a, b) { var c = a.series.xAxis, d = b.series.yAxis, e = m.pointToPixels(a), l = m.pointToPixels(b), h = l.x - e.x, k = l.y - e.y; b = c.left; var n = b + c.width; c = d.top; d = c + d.height; var u = 0 > h ? b : n, r = 0 > k ? c : d; n = { x: 0 === h ? e.x : u, y: 0 === k ? e.y : r }; 0 !== h && 0 !== k && (h = f.findEdgeCoordinate(e, l, "y", u), e = f.findEdgeCoordinate(e, l, "x", r), h >= c && h <= d ? (n.x = u, n.y = h) : (n.x = e, n.y = r)); n.x -= b; n.y -= c; a.series.chart.inverted && (a = n.x, n.x = n.y, n.y = a); return n }; var d = function (a, b) {
                return function (c) {
                    c = c.annotation;
                    var g = c.points, d = c.options.typeOptions.type; "horizontalLine" === d ? g = [g[0], new m(c.chart, g[0].target, { x: g[0].x + 1, y: g[0].y, xAxis: g[0].options.xAxis, yAxis: g[0].options.yAxis })] : "verticalLine" === d && (g = [g[0], new m(c.chart, g[0].target, { x: g[0].x, y: g[0].y + 1, xAxis: g[0].options.xAxis, yAxis: g[0].options.yAxis })]); return f.findEdgePoint(g[a], g[b])
                }
            }; f.endEdgePoint = d(0, 1); f.startEdgePoint = d(1, 0); e.extendAnnotation(f, c, {
                addShapes: function () {
                    var a = this.options.typeOptions, b = [this.points[0], f.endEdgePoint]; a.type.match(/Line/g) &&
                        (b[0] = f.startEdgePoint); b = this.initShape(e.merge(a.line, { type: "path", points: b }), !1); a.line = b.options
                }
            }); return t.types.infinityLine = f
        }); v(f, "annotations/types/Fibonacci.js", [f["parts/Globals.js"]], function (e) {
            function f() { this.startRetracements = []; this.endRetracements = []; c.apply(this, arguments) } var t = e.Annotation, m = t.MockPoint, c = t.types.tunnel, d = function (a, b) {
                return function () {
                    var c = this.annotation, d = this.anchor(c.startRetracements[a]).absolutePosition, e = this.anchor(c.endRetracements[a]).absolutePosition;
                    d = ["M", Math.round(d.x), Math.round(d.y), "L", Math.round(e.x), Math.round(e.y)]; b && (e = this.anchor(c.endRetracements[a - 1]).absolutePosition, c = this.anchor(c.startRetracements[a - 1]).absolutePosition, d.push("L", Math.round(e.x), Math.round(e.y), "L", Math.round(c.x), Math.round(c.y))); return d
                }
            }; f.levels = [0, .236, .382, .5, .618, .786, 1]; e.extendAnnotation(f, c, {
                linkPoints: function () { c.prototype.linkPoints.call(this); this.linkRetracementsPoints() }, linkRetracementsPoints: function () {
                    var a = this.points, b = a[0].y - a[3].y,
                    c = a[1].y - a[2].y, d = a[0].x, e = a[1].x; f.levels.forEach(function (g, h) { var l = a[1].y - c * g; this.linkRetracementPoint(h, d, a[0].y - b * g, this.startRetracements); this.linkRetracementPoint(h, e, l, this.endRetracements) }, this)
                }, linkRetracementPoint: function (a, b, c, d) { var g = d[a], e = this.options.typeOptions; g ? (g.options.x = b, g.options.y = c, g.refresh()) : d[a] = new m(this.chart, this, { x: b, y: c, xAxis: e.xAxis, yAxis: e.yAxis }) }, addShapes: function () {
                    f.levels.forEach(function (a, b) {
                        this.initShape({ type: "path", d: d(b) }, !1); 0 < b && this.initShape({
                            type: "path",
                            fill: this.options.typeOptions.backgroundColors[b - 1], strokeWidth: 0, d: d(b, !0)
                        })
                    }, this)
                }, addLabels: function () { f.levels.forEach(function (a, b) { var c = this.options.typeOptions; a = this.initLabel(e.merge(c.labels[b], { point: function (a) { return m.pointToOptions(a.annotation.startRetracements[b]) }, text: a.toString() })); c.labels[b] = a.options }, this) }
            }, {
                typeOptions: {
                    height: 2, backgroundColors: "rgba(130, 170, 255, 0.4);rgba(139, 191, 216, 0.4);rgba(150, 216, 192, 0.4);rgba(156, 229, 161, 0.4);rgba(162, 241, 130, 0.4);rgba(169, 255, 101, 0.4)".split(";"),
                    lineColor: "grey", lineColors: [], labels: []
                }, labelOptions: { allowOverlap: !0, align: "right", backgroundColor: "none", borderWidth: 0, crop: !1, overflow: "none", shape: "rect", style: { color: "grey" }, verticalAlign: "middle", y: 0 }
            }); return t.types.fibonacci = f
        }); v(f, "annotations/types/Pitchfork.js", [f["parts/Globals.js"]], function (e) {
            function f() { c.apply(this, arguments) } var t = e.Annotation, m = t.MockPoint, c = t.types.infinityLine; f.findEdgePoint = function (a, b, c) {
                b = Math.atan2(c.plotY - b.plotY, c.plotX - b.plotX); return {
                    x: a.plotX +
                        1E7 * Math.cos(b), y: a.plotY + 1E7 * Math.sin(b)
                }
            }; f.middleLineEdgePoint = function (a) { var b = a.annotation; return c.findEdgePoint(b.points[0], new m(b.chart, a, b.midPointOptions())) }; var d = function (a) { return function (b) { var c = b.annotation, d = c.points; return f.findEdgePoint(d[a], d[0], new m(c.chart, b, c.midPointOptions())) } }; f.topLineEdgePoint = d(1); f.bottomLineEdgePoint = d(0); e.extendAnnotation(f, c, {
                midPointOptions: function () {
                    var a = this.points; return {
                        x: (a[1].x + a[2].x) / 2, y: (a[1].y + a[2].y) / 2, xAxis: a[0].series.xAxis,
                        yAxis: a[0].series.yAxis
                    }
                }, addShapes: function () { this.addLines(); this.addBackgrounds() }, addLines: function () { this.initShape({ type: "path", points: [this.points[0], f.middleLineEdgePoint] }, !1); this.initShape({ type: "path", points: [this.points[1], f.topLineEdgePoint] }, !1); this.initShape({ type: "path", points: [this.points[2], f.bottomLineEdgePoint] }, !1) }, addBackgrounds: function () {
                    var a = this.shapes, b = this.options.typeOptions, c = this.initShape(e.merge(b.innerBackground, {
                        type: "path", points: [function (b) {
                            var a = b.annotation;
                            b = a.points; a = a.midPointOptions(); return { x: (b[1].x + a.x) / 2, y: (b[1].y + a.y) / 2, xAxis: a.xAxis, yAxis: a.yAxis }
                        }, a[1].points[1], a[2].points[1], function (b) { var a = b.annotation; b = a.points; a = a.midPointOptions(); return { x: (a.x + b[2].x) / 2, y: (a.y + b[2].y) / 2, xAxis: a.xAxis, yAxis: a.yAxis } }]
                    })); a = this.initShape(e.merge(b.outerBackground, { type: "path", points: [this.points[1], a[1].points[1], a[2].points[1], this.points[2]] })); b.innerBackground = c.options; b.outerBackground = a.options
                }
            }, {
                typeOptions: {
                    innerBackground: {
                        fill: "rgba(130, 170, 255, 0.4)",
                        strokeWidth: 0
                    }, outerBackground: { fill: "rgba(156, 229, 161, 0.4)", strokeWidth: 0 }
                }
            }); return t.types.pitchfork = f
        }); v(f, "annotations/types/VerticalLine.js", [f["parts/Globals.js"]], function (e) {
            function f() { e.Annotation.apply(this, arguments) } var t = e.Annotation, m = t.MockPoint; f.connectorFirstPoint = function (c) { c = c.annotation; var d = c.points[0], a = m.pointToPixels(d, !0), b = a.y, g = c.options.typeOptions.label.offset; c.chart.inverted && (b = a.x); return { x: d.x, xAxis: d.series.xAxis, y: b + g } }; f.connectorSecondPoint = function (c) {
                var d =
                    c.annotation; c = d.options.typeOptions; var a = d.points[0], b = c.yOffset; d = m.pointToPixels(a, !0)[d.chart.inverted ? "x" : "y"]; 0 > c.label.offset && (b *= -1); return { x: a.x, xAxis: a.series.xAxis, y: d + b }
            }; e.extendAnnotation(f, null, {
                getPointsOptions: function () { return [this.options.typeOptions.point] }, addShapes: function () { var c = this.options.typeOptions, d = this.initShape(e.merge(c.connector, { type: "path", points: [f.connectorFirstPoint, f.connectorSecondPoint] }), !1); c.connector = d.options }, addLabels: function () {
                    var c = this.options.typeOptions,
                    d = c.label, a = 0, b = d.offset, g = 0 > d.offset ? "bottom" : "top", f = "center"; this.chart.inverted && (a = d.offset, b = 0, g = "middle", f = 0 > d.offset ? "right" : "left"); d = this.initLabel(e.merge(d, { verticalAlign: g, align: f, x: a, y: b })); c.label = d.options
                }
            }, { typeOptions: { yOffset: 10, label: { offset: -40, point: function (c) { return c.annotation.points[0] }, allowOverlap: !0, backgroundColor: "none", borderWidth: 0, crop: !0, overflow: "none", shape: "rect", text: "{y:.2f}" }, connector: { strokeWidth: 1, markerEnd: "arrow" } } }); return t.types.verticalLine = f
        });
    v(f, "annotations/types/Measure.js", [f["parts/Globals.js"], f["parts/Utilities.js"]], function (e, f) {
        function k() { c.apply(this, arguments) } var m = f.isNumber, c = e.Annotation, d = c.ControlPoint, a = e.merge; c.types.measure = k; e.extendAnnotation(k, null, {
            init: function () { c.prototype.init.apply(this, arguments); this.resizeY = this.resizeX = this.offsetY = this.offsetX = 0; this.calculations.init.call(this); this.addValues(); this.addShapes() }, setClipAxes: function () {
            this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
                this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis]
            }, pointsOptions: function () { return this.options.options.points }, shapePointsOptions: function () { var b = this.options.typeOptions, a = b.xAxis; b = b.yAxis; return [{ x: this.xAxisMin, y: this.yAxisMin, xAxis: a, yAxis: b }, { x: this.xAxisMax, y: this.yAxisMin, xAxis: a, yAxis: b }, { x: this.xAxisMax, y: this.yAxisMax, xAxis: a, yAxis: b }, { x: this.xAxisMin, y: this.yAxisMax, xAxis: a, yAxis: b }] }, addControlPoints: function () {
                var b = this.options.typeOptions.selectType; var a = new d(this.chart,
                    this, this.options.controlPointOptions, 0); this.controlPoints.push(a); "xy" !== b && (a = new d(this.chart, this, this.options.controlPointOptions, 1), this.controlPoints.push(a))
            }, addValues: function (b) {
                var a = this.options.typeOptions, c = a.label.formatter; this.calculations.recalculate.call(this, b); a.label.enabled && (0 < this.labels.length ? this.labels[0].text = c && c.call(this) || this.calculations.defaultFormatter.call(this) : this.initLabel(e.extend({
                    shape: "rect", backgroundColor: "none", color: "black", borderWidth: 0, dashStyle: "dash",
                    overflow: "none", align: "left", vertical: "top", crop: !0, point: function (b) { b = b.annotation; var c = b.chart, d = c.inverted, g = c.yAxis[a.yAxis], e = c.plotTop, f = c.plotLeft; return { x: (d ? e : 10) + c.xAxis[a.xAxis].toPixels(b.xAxisMin, !d), y: (d ? -f + 10 : e) + g.toPixels(b.yAxisMin) } }, text: c && c.call(this) || this.calculations.defaultFormatter.call(this)
                }, a.label)))
            }, addShapes: function () { this.addCrosshairs(); this.addBackground() }, addBackground: function () {
            void 0 !== this.shapePointsOptions()[0].x && this.initShape(e.extend({
                type: "path",
                points: this.shapePointsOptions()
            }, this.options.typeOptions.background), !1)
            }, addCrosshairs: function () {
                var b = this.chart, c = this.options.typeOptions, d = this.options.typeOptions.point, f = b.xAxis[c.xAxis], l = b.yAxis[c.yAxis], h = b.inverted; b = f.toPixels(this.xAxisMin); f = f.toPixels(this.xAxisMax); var k = l.toPixels(this.yAxisMin), n = l.toPixels(this.yAxisMax), u = { point: d, type: "path" }; d = []; l = []; h && (h = b, b = k, k = h, h = f, f = n, n = h); c.crosshairX.enabled && (d = ["M", b, k + (n - k) / 2, "L", f, k + (n - k) / 2]); c.crosshairY.enabled && (l = ["M", b + (f -
                    b) / 2, k, "L", b + (f - b) / 2, n]); 0 < this.shapes.length ? (this.shapes[0].options.d = d, this.shapes[1].options.d = l) : (b = a(u, c.crosshairX), c = a(u, c.crosshairY), this.initShape(e.extend({ d: d }, b), !1), this.initShape(e.extend({ d: l }, c), !1))
            }, onDrag: function (b) { var a = this.mouseMoveToTranslation(b), c = this.options.typeOptions.selectType; b = "y" === c ? 0 : a.x; a = "x" === c ? 0 : a.y; this.translate(b, a); this.offsetX += b; this.offsetY += a; this.redraw(!1, !1, !0) }, resize: function (b, a, c, d) {
                var e = this.shapes[2]; "x" === d ? 0 === c ? (e.translatePoint(b, 0,
                    0), e.translatePoint(b, a, 3)) : (e.translatePoint(b, 0, 1), e.translatePoint(b, a, 2)) : "y" === d ? 0 === c ? (e.translatePoint(0, a, 0), e.translatePoint(0, a, 1)) : (e.translatePoint(0, a, 2), e.translatePoint(0, a, 3)) : (e.translatePoint(b, 0, 1), e.translatePoint(b, a, 2), e.translatePoint(0, a, 3)); this.calculations.updateStartPoints.call(this, !1, !0, c, b, a); this.options.typeOptions.background.height = Math.abs(this.startYMax - this.startYMin); this.options.typeOptions.background.width = Math.abs(this.startXMax - this.startXMin)
            }, redraw: function (b,
                a, c) { this.linkPoints(); this.graphic || this.render(); c && this.calculations.updateStartPoints.call(this, !0, !1); this.clipRect && this.clipRect.animate(this.getClipBox()); this.addValues(a); this.addCrosshairs(); this.redrawItems(this.shapes, b); this.redrawItems(this.labels, b); this.controlPoints.forEach(function (b) { b.redraw() }) }, translate: function (b, a) { this.shapes.forEach(function (c) { c.translate(b, a) }); this.options.typeOptions.point.x = this.startXMin; this.options.typeOptions.point.y = this.startYMin }, calculations: {
                    init: function () {
                        var b =
                            this.options.typeOptions, a = this.chart, c = this.calculations.getPointPos, d = a.inverted, e = a.xAxis[b.xAxis], h = a.yAxis[b.yAxis], f = b.background, n = d ? f.height : f.width; f = d ? f.width : f.height; var u = b.selectType, r = d ? a.plotLeft : a.plotTop; a = d ? a.plotTop : a.plotLeft; this.startXMin = b.point.x; this.startYMin = b.point.y; m(n) ? this.startXMax = this.startXMin + n : this.startXMax = c(e, this.startXMin, parseFloat(n)); m(f) ? this.startYMax = this.startYMin - f : this.startYMax = c(h, this.startYMin, parseFloat(f)); "x" === u ? (this.startYMin = h.toValue(r),
                                this.startYMax = h.toValue(r + h.len)) : "y" === u && (this.startXMin = e.toValue(a), this.startXMax = e.toValue(a + e.len))
                    }, recalculate: function (b) {
                        var a = this.calculations, c = this.options.typeOptions, d = this.chart.xAxis[c.xAxis]; c = this.chart.yAxis[c.yAxis]; var e = this.calculations.getPointPos, h = this.offsetX, f = this.offsetY; this.xAxisMin = e(d, this.startXMin, h); this.xAxisMax = e(d, this.startXMax, h); this.yAxisMin = e(c, this.startYMin, f); this.yAxisMax = e(c, this.startYMax, f); this.min = a.min.call(this); this.max = a.max.call(this);
                        this.average = a.average.call(this); this.bins = a.bins.call(this); b && this.resize(0, 0)
                    }, getPointPos: function (b, a, c) { return b.toValue(b.toPixels(a) + c) }, updateStartPoints: function (b, a, c, d, e) {
                        var f = this.options.typeOptions, g = f.selectType, n = this.chart.xAxis[f.xAxis]; f = this.chart.yAxis[f.yAxis]; var l = this.calculations.getPointPos, r = this.startXMin, x = this.startXMax, k = this.startYMin, p = this.startYMax, m = this.offsetX, q = this.offsetY; a && ("x" === g ? 0 === c ? this.startXMin = l(n, r, d) : this.startXMax = l(n, x, d) : "y" === g ? 0 === c ? this.startYMin =
                            l(f, k, e) : this.startYMax = l(f, p, e) : (this.startXMax = l(n, x, d), this.startYMax = l(f, p, e))); b && (this.startXMin = l(n, r, m), this.startXMax = l(n, x, m), this.startYMin = l(f, k, q), this.startYMax = l(f, p, q), this.offsetY = this.offsetX = 0)
                    }, defaultFormatter: function () { return "Min: " + this.min + "<br>Max: " + this.max + "<br>Average: " + this.average + "<br>Bins: " + this.bins }, getExtremes: function (b, a, c, d) { return { xAxisMin: Math.min(a, b), xAxisMax: Math.max(a, b), yAxisMin: Math.min(d, c), yAxisMax: Math.max(d, c) } }, min: function () {
                        var b = Infinity, a =
                            this.chart.series, c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax), d = !1; a.forEach(function (a) { a.visible && "highcharts-navigator-series" !== a.options.id && a.points.forEach(function (a) { !a.isNull && a.y < b && a.x > c.xAxisMin && a.x <= c.xAxisMax && a.y > c.yAxisMin && a.y <= c.yAxisMax && (b = a.y, d = !0) }) }); d || (b = ""); return b
                    }, max: function () {
                        var b = -Infinity, a = this.chart.series, c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax), d = !1; a.forEach(function (a) {
                        a.visible &&
                            "highcharts-navigator-series" !== a.options.id && a.points.forEach(function (a) { !a.isNull && a.y > b && a.x > c.xAxisMin && a.x <= c.xAxisMax && a.y > c.yAxisMin && a.y <= c.yAxisMax && (b = a.y, d = !0) })
                        }); d || (b = ""); return b
                    }, average: function () { var a = ""; "" !== this.max && "" !== this.min && (a = (this.max + this.min) / 2); return a }, bins: function () {
                        var a = 0, c = this.chart.series, d = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax), e = !1; c.forEach(function (b) {
                        b.visible && "highcharts-navigator-series" !== b.options.id &&
                            b.points.forEach(function (b) { !b.isNull && b.x > d.xAxisMin && b.x <= d.xAxisMax && b.y > d.yAxisMin && b.y <= d.yAxisMax && (a++ , e = !0) })
                        }); e || (a = ""); return a
                    }
                }
        }, {
            typeOptions: { selectType: "xy", xAxis: 0, yAxis: 0, background: { fill: "rgba(130, 170, 255, 0.4)", strokeWidth: 0, stroke: void 0 }, crosshairX: { enabled: !0, zIndex: 6, dashStyle: "Dash", markerEnd: "arrow" }, crosshairY: { enabled: !0, zIndex: 6, dashStyle: "Dash", markerEnd: "arrow" }, label: { enabled: !0, style: { fontSize: "11px", color: "#666666" }, formatter: void 0 } }, controlPointOptions: {
                positioner: function (a) {
                    var b =
                        this.index, c = a.chart, d = a.options, e = d.typeOptions, f = e.selectType; d = d.controlPointOptions; var k = c.inverted, n = c.xAxis[e.xAxis]; c = c.yAxis[e.yAxis]; e = a.xAxisMax; var u = a.yAxisMax, r = a.calculations.getExtremes(a.xAxisMin, a.xAxisMax, a.yAxisMin, a.yAxisMax); "x" === f && (u = (r.yAxisMax - r.yAxisMin) / 2, 0 === b && (e = a.xAxisMin)); "y" === f && (e = r.xAxisMin + (r.xAxisMax - r.xAxisMin) / 2, 0 === b && (u = a.yAxisMin)); k ? (a = c.toPixels(u), b = n.toPixels(e)) : (a = n.toPixels(e), b = c.toPixels(u)); return { x: a - d.width / 2, y: b - d.height / 2 }
                }, events: {
                    drag: function (a,
                        c) { var b = this.mouseMoveToTranslation(a); a = c.options.typeOptions.selectType; var d = "y" === a ? 0 : b.x; b = "x" === a ? 0 : b.y; c.resize(d, b, this.index, a); c.resizeX += d; c.resizeY += b; c.redraw(!1, !0) }
                }
            }
        }); return c.types.measure = k
    }); v(f, "mixins/navigation.js", [], function () {
        return {
            initUpdate: function (e) { e.navigation || (e.navigation = { updates: [], update: function (e, f) { this.updates.forEach(function (k) { k.update.call(k.context, e, f) }) } }) }, addUpdate: function (e, f) {
            f.navigation || this.initUpdate(f); f.navigation.updates.push({
                update: e,
                context: f
            })
            }
        }
    }); v(f, "annotations/navigationBindings.js", [f["parts/Globals.js"], f["parts/Utilities.js"], f["mixins/navigation.js"]], function (e, f, t) {
        function k(a) {
            var b = a.prototype.defaultOptions.events && a.prototype.defaultOptions.events.click; e.merge(!0, a.prototype.defaultOptions.events, {
                click: function (a) {
                    var c = this, d = c.chart.navigationBindings, e = d.activeAnnotation; b && b.click.call(c, a); e !== c ? (d.deselectAnnotation(), d.activeAnnotation = c, c.setControlPointsVisibility(!0), w(d, "showPopup", {
                        annotation: c,
                        formType: "annotation-toolbar", options: d.annotationToFields(c), onSubmit: function (a) { var b = {}; "remove" === a.actionType ? (d.activeAnnotation = !1, d.chart.removeAnnotation(c)) : (d.fieldsToOptions(a.fields, b), d.deselectAnnotation(), a = b.typeOptions, "measure" === c.options.type && (a.crosshairY.enabled = 0 !== a.crosshairY.strokeWidth, a.crosshairX.enabled = 0 !== a.crosshairX.strokeWidth), c.update(b)) }
                    })) : (d.deselectAnnotation(), w(d, "closePopup")); a.activeAnnotation = !0
                }
            })
        } var c = f.isArray, d = f.isNumber, a = f.isObject, b = f.objectEach,
            g = e.doc, p = e.win, q = e.addEvent, l = e.pick, h = e.merge; f = e.extend; var w = e.fireEvent; e.NavigationBindings = function (a, b) { this.chart = a; this.options = b; this.eventsToUnbind = []; this.container = g.getElementsByClassName(this.options.bindingsClassName) }; e.NavigationBindings.annotationsEditable = {
                nestedOptions: {
                    labelOptions: ["style", "format", "backgroundColor"], labels: ["style"], label: ["style"], style: ["fontSize", "color"], background: ["fill", "strokeWidth", "stroke"], innerBackground: ["fill", "strokeWidth", "stroke"], outerBackground: ["fill",
                        "strokeWidth", "stroke"], shapeOptions: ["fill", "strokeWidth", "stroke"], shapes: ["fill", "strokeWidth", "stroke"], line: ["strokeWidth", "stroke"], backgroundColors: [!0], connector: ["fill", "strokeWidth", "stroke"], crosshairX: ["strokeWidth", "stroke"], crosshairY: ["strokeWidth", "stroke"]
                }, circle: ["shapes"], verticalLine: [], label: ["labelOptions"], measure: ["background", "crosshairY", "crosshairX"], fibonacci: [], tunnel: ["background", "line", "height"], pitchfork: ["innerBackground", "outerBackground"], rect: ["shapes"], crookedLine: []
            };
        e.NavigationBindings.annotationsNonEditable = { rectangle: ["crosshairX", "crosshairY", "label"] }; f(e.NavigationBindings.prototype, {
            initEvents: function () {
                var a = this, c = a.chart, d = a.container, f = a.options; a.boundClassNames = {}; b(f.bindings, function (b) { a.boundClassNames[b.className] = b });[].forEach.call(d, function (b) { a.eventsToUnbind.push(q(b, "click", function (b) { var c = a.getButtonEvents(d, b); c && a.bindingsButtonClick(c.button, c.events, b) })) }); b(f.events || {}, function (b, c) {
                    e.isFunction(b) && a.eventsToUnbind.push(q(a,
                        c, b))
                }); a.eventsToUnbind.push(q(c.container, "click", function (b) { !c.cancelClick && c.isInsidePlot(b.chartX - c.plotLeft, b.chartY - c.plotTop) && a.bindingsChartClick(this, b) })); a.eventsToUnbind.push(q(c.container, "mousemove", function (b) { a.bindingsContainerMouseMove(this, b) }))
            }, initUpdate: function () { var a = this; t.addUpdate(function (b) { a.update(b) }, this.chart) }, bindingsButtonClick: function (a, b, c) {
                var d = this.chart; this.selectedButtonElement && (w(this, "deselectButton", { button: this.selectedButtonElement }), this.nextEvent &&
                    (this.currentUserDetails && "annotations" === this.currentUserDetails.coll && d.removeAnnotation(this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1)); this.selectedButton = b; this.selectedButtonElement = a; w(this, "selectButton", { button: a }); b.init && b.init.call(this, a, c); (b.start || b.steps) && d.renderer.boxWrapper.addClass("highcharts-draw-mode")
            }, bindingsChartClick: function (a, b) {
                a = this.selectedButton; var c = this.chart.renderer.boxWrapper, d; if (d = this.activeAnnotation && !b.activeAnnotation && b.target.parentNode) {
                    a: {
                        d =
                        b.target; var e = p.Element.prototype, f = e.matches || e.msMatchesSelector || e.webkitMatchesSelector, h = null; if (e.closest) h = e.closest.call(d, ".highcharts-popup"); else { do { if (f.call(d, ".highcharts-popup")) break a; d = d.parentElement || d.parentNode } while (null !== d && 1 === d.nodeType) } d = h
                    } d = !d
                } d && (w(this, "closePopup"), this.deselectAnnotation()); a && a.start && (this.nextEvent ? (this.nextEvent(b, this.currentUserDetails), this.steps && (this.stepIndex++ , a.steps[this.stepIndex] ? this.mouseMoveEvent = this.nextEvent = a.steps[this.stepIndex] :
                    (w(this, "deselectButton", { button: this.selectedButtonElement }), c.removeClass("highcharts-draw-mode"), a.end && a.end.call(this, b, this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1, this.selectedButton = null))) : (this.currentUserDetails = a.start.call(this, b), a.steps ? (this.stepIndex = 0, this.steps = !0, this.mouseMoveEvent = this.nextEvent = a.steps[this.stepIndex]) : (w(this, "deselectButton", { button: this.selectedButtonElement }), c.removeClass("highcharts-draw-mode"), this.steps = !1, this.selectedButton = null,
                        a.end && a.end.call(this, b, this.currentUserDetails))))
            }, bindingsContainerMouseMove: function (a, b) { this.mouseMoveEvent && this.mouseMoveEvent(b, this.currentUserDetails) }, fieldsToOptions: function (a, c) { b(a, function (a, b) { var e = parseFloat(a), f = b.split("."), h = c, g = f.length - 1; !d(e) || a.match(/px/g) || b.match(/format/g) || (a = e); "" !== a && "undefined" !== a && f.forEach(function (b, c) { var d = l(f[c + 1], ""); g === c ? h[b] = a : (h[b] || (h[b] = d.match(/\d/g) ? [] : {}), h = h[b]) }) }); return c }, deselectAnnotation: function () {
            this.activeAnnotation &&
                (this.activeAnnotation.setControlPointsVisibility(!1), this.activeAnnotation = !1)
            }, annotationToFields: function (d) {
                function f(h, g, l, r) {
                    if (l && -1 === m.indexOf(g) && (0 <= (l.indexOf && l.indexOf(g)) || l[g] || !0 === l)) if (c(h)) r[g] = [], h.forEach(function (c, d) { a(c) ? (r[g][d] = {}, b(c, function (a, b) { f(a, b, n[g], r[g][d]) })) : f(c, 0, n[g], r[g]) }); else if (a(h)) { var u = {}; c(r) ? (r.push(u), u[g] = {}, u = u[g]) : r[g] = u; b(h, function (a, b) { f(a, b, 0 === g ? l : n[g], u) }) } else "format" === g ? r[g] = [e.format(h, d.labels[0].points[0]).toString(), "text"] : c(r) ?
                        r.push([h, k(h)]) : r[g] = [h, k(h)]
                } var h = d.options, g = e.NavigationBindings.annotationsEditable, n = g.nestedOptions, k = this.utils.getFieldType, w = l(h.type, h.shapes && h.shapes[0] && h.shapes[0].type, h.labels && h.labels[0] && h.labels[0].itemType, "label"), m = e.NavigationBindings.annotationsNonEditable[h.langKey] || [], p = { langKey: h.langKey, type: w }; b(h, function (a, c) { "typeOptions" === c ? (p[c] = {}, b(h[c], function (a, b) { f(a, b, n, p[c], !0) })) : f(a, c, g[w], p) }); return p
            }, getClickedClassNames: function (a, b) {
                var c = b.target; b = []; for (var d; c &&
                    ((d = e.attr(c, "class")) && (b = b.concat(d.split(" ").map(function (a) { return [a, c] }))), c = c.parentNode, c !== a);); return b
            }, getButtonEvents: function (a, b) { var c = this, d; this.getClickedClassNames(a, b).forEach(function (a) { c.boundClassNames[a[0]] && !d && (d = { events: c.boundClassNames[a[0]], button: a[1] }) }); return d }, update: function (a) { this.options = h(!0, this.options, a); this.removeEvents(); this.initEvents() }, removeEvents: function () { this.eventsToUnbind.forEach(function (a) { a() }) }, destroy: function () { this.removeEvents() },
            utils: { updateRectSize: function (a, b) { var c = b.chart, d = b.options.typeOptions, e = c.pointer.getCoordinates(a); a = e.xAxis[0].value - d.point.x; d = d.point.y - e.yAxis[0].value; b.update({ typeOptions: { background: { width: c.inverted ? d : a, height: c.inverted ? a : d } } }) }, getFieldType: function (a) { return { string: "text", number: "number", "boolean": "checkbox" }[typeof a] } }
        }); e.Chart.prototype.initNavigationBindings = function () {
            var a = this.options; a && a.navigation && a.navigation.bindings && (this.navigationBindings = new e.NavigationBindings(this,
                a.navigation), this.navigationBindings.initEvents(), this.navigationBindings.initUpdate())
        }; q(e.Chart, "load", function () { this.initNavigationBindings() }); q(e.Chart, "destroy", function () { this.navigationBindings && this.navigationBindings.destroy() }); q(e.NavigationBindings, "deselectButton", function () { this.selectedButtonElement = null }); q(e.Annotation, "remove", function () { this.chart.navigationBindings && this.chart.navigationBindings.deselectAnnotation() }); e.Annotation && (k(e.Annotation), b(e.Annotation.types, function (a) { k(a) }));
        e.setOptions({
            lang: {
                navigation: {
                    popup: {
                        simpleShapes: "Simple shapes", lines: "Lines", circle: "Circle", rectangle: "Rectangle", label: "Label", shapeOptions: "Shape options", typeOptions: "Details", fill: "Fill", format: "Text", strokeWidth: "Line width", stroke: "Line color", title: "Title", name: "Name", labelOptions: "Label options", labels: "Labels", backgroundColor: "Background color", backgroundColors: "Background colors", borderColor: "Border color", borderRadius: "Border radius", borderWidth: "Border width", style: "Style", padding: "Padding",
                        fontSize: "Font size", color: "Color", height: "Height", shapes: "Shape options"
                    }
                }
            }, navigation: {
                bindingsClassName: "highcharts-bindings-container", bindings: {
                    circleAnnotation: {
                        className: "highcharts-circle-annotation", start: function (a) {
                            a = this.chart.pointer.getCoordinates(a); var b = this.chart.options.navigation; return this.chart.addAnnotation(h({
                                langKey: "circle", shapes: [{
                                    type: "circle", point: { xAxis: 0, yAxis: 0, x: a.xAxis[0].value, y: a.yAxis[0].value }, r: 5, controlPoints: [{
                                        positioner: function (a) {
                                            var b = e.Annotation.MockPoint.pointToPixels(a.points[0]);
                                            a = a.options.r; return { x: b.x + a * Math.cos(Math.PI / 4) - this.graphic.width / 2, y: b.y + a * Math.sin(Math.PI / 4) - this.graphic.height / 2 }
                                        }, events: { drag: function (a, b) { var c = b.annotation; a = this.mouseMoveToTranslation(a); b.setRadius(Math.max(b.options.r + a.y / Math.sin(Math.PI / 4), 5)); c.options.shapes[0] = c.userOptions.shapes[0] = b.options; b.redraw(!1) } }
                                    }]
                                }]
                            }, b.annotationsOptions, b.bindings.circleAnnotation.annotationsOptions))
                        }, steps: [function (a, b) {
                            var c = b.options.shapes[0].point, d = this.chart.xAxis[0].toPixels(c.x); c = this.chart.yAxis[0].toPixels(c.y);
                            var e = this.chart.inverted; b.update({ shapes: [{ r: Math.max(Math.sqrt(Math.pow(e ? c - a.chartX : d - a.chartX, 2) + Math.pow(e ? d - a.chartY : c - a.chartY, 2)), 5) }] })
                        }]
                    }, rectangleAnnotation: {
                        className: "highcharts-rectangle-annotation", start: function (a) {
                            var b = this.chart.pointer.getCoordinates(a); a = this.chart.options.navigation; var c = b.xAxis[0].value; b = b.yAxis[0].value; return this.chart.addAnnotation(h({
                                langKey: "rectangle", shapes: [{
                                    type: "path", points: [{ xAxis: 0, yAxis: 0, x: c, y: b }, { xAxis: 0, yAxis: 0, x: c, y: b }, {
                                        xAxis: 0, yAxis: 0,
                                        x: c, y: b
                                    }, { xAxis: 0, yAxis: 0, x: c, y: b }]
                                }], controlPoints: [{ positioner: function (a) { a = e.Annotation.MockPoint.pointToPixels(a.shapes[0].points[2]); return { x: a.x - 4, y: a.y - 4 } }, events: { drag: function (a, b) { var c = this.chart.pointer.getCoordinates(a); a = c.xAxis[0].value; c = c.yAxis[0].value; var d = b.options.shapes[0].points; d[1].x = a; d[2].x = a; d[2].y = c; d[3].y = c; b.options.shapes[0].points = d; b.redraw(!1) } } }]
                            }, a.annotationsOptions, a.bindings.rectangleAnnotation.annotationsOptions))
                        }, steps: [function (a, b) {
                            var c = b.options.shapes[0].points,
                            d = this.chart.pointer.getCoordinates(a); a = d.xAxis[0].value; d = d.yAxis[0].value; c[1].x = a; c[2].x = a; c[2].y = d; c[3].y = d; b.update({ shapes: [{ points: c }] })
                        }]
                    }, labelAnnotation: {
                        className: "highcharts-label-annotation", start: function (a) {
                            a = this.chart.pointer.getCoordinates(a); var b = this.chart.options.navigation; return this.chart.addAnnotation(h({
                                langKey: "label", labelOptions: { format: "{y:.2f}" }, labels: [{
                                    point: { xAxis: 0, yAxis: 0, x: a.xAxis[0].value, y: a.yAxis[0].value }, overflow: "none", crop: !0, controlPoints: [{
                                        symbol: "triangle-down",
                                        positioner: function (a) { if (!a.graphic.placed) return { x: 0, y: -9E7 }; a = e.Annotation.MockPoint.pointToPixels(a.points[0]); return { x: a.x - this.graphic.width / 2, y: a.y - this.graphic.height / 2 } }, events: { drag: function (a, b) { a = this.mouseMoveToTranslation(a); b.translatePoint(a.x, a.y); b.annotation.labels[0].options = b.options; b.redraw(!1) } }
                                    }, {
                                        symbol: "square", positioner: function (a) { return a.graphic.placed ? { x: a.graphic.alignAttr.x - this.graphic.width / 2, y: a.graphic.alignAttr.y - this.graphic.height / 2 } : { x: 0, y: -9E7 } }, events: {
                                            drag: function (a,
                                                b) { a = this.mouseMoveToTranslation(a); b.translate(a.x, a.y); b.annotation.labels[0].options = b.options; b.redraw(!1) }
                                        }
                                    }]
                                }]
                            }, b.annotationsOptions, b.bindings.labelAnnotation.annotationsOptions))
                        }
                    }
                }, events: {}, annotationsOptions: {}
            }
        })
    }); v(f, "annotations/popup.js", [f["parts/Globals.js"], f["parts/Utilities.js"]], function (e, f) {
        var k = f.defined, m = f.isArray, c = f.isObject, d = f.isString, a = f.objectEach, b = e.addEvent, g = e.createElement, p = e.pick; f = e.wrap; var q = /\d/g; f(e.Pointer.prototype, "onContainerMouseDown", function (a,
            b) { var c = b.target && b.target.className; d(c) && 0 <= c.indexOf("highcharts-popup-field") || a.apply(this, Array.prototype.slice.call(arguments, 1)) }); e.Popup = function (a, b) { this.init(a, b) }; e.Popup.prototype = {
                init: function (a, b) { this.container = g("div", { className: "highcharts-popup" }, null, a); this.lang = this.getLangpack(); this.iconsURL = b; this.addCloseBtn() }, addCloseBtn: function () {
                    var a = this; var c = g("div", { className: "highcharts-popup-close" }, null, this.container); c.style["background-image"] = "url(" + this.iconsURL + "close.svg)";
                    ["click", "touchstart"].forEach(function (d) { b(c, d, function () { a.closePopup() }) })
                }, addColsContainer: function (a) { var b = g("div", { className: "highcharts-popup-lhs-col" }, null, a); a = g("div", { className: "highcharts-popup-rhs-col" }, null, a); g("div", { className: "highcharts-popup-rhs-col-wrapper" }, null, a); return { lhsCol: b, rhsCol: a } }, addInput: function (a, b, c, d) {
                    var e = a.split("."); e = e[e.length - 1]; var f = this.lang; b = "highcharts-" + b + "-" + e; b.match(q) || g("label", { innerHTML: f[e] || e, htmlFor: b }, null, c); g("input", {
                        name: b, value: d[0],
                        type: d[1], className: "highcharts-popup-field"
                    }, null, c).setAttribute("highcharts-data-name", a)
                }, addButton: function (a, c, d, e, f) { var h = this, l = this.closePopup, n = this.getFields; var k = g("button", { innerHTML: c }, null, a);["click", "touchstart"].forEach(function (a) { b(k, a, function () { l.call(h); return e(n(f, d)) }) }); return k }, getFields: function (a, b) {
                    var c = a.querySelectorAll("input"), d = a.querySelectorAll("#highcharts-select-series > option:checked")[0]; a = a.querySelectorAll("#highcharts-select-volume > option:checked")[0];
                    var e, f; var g = { actionType: b, linkedTo: d && d.getAttribute("value"), fields: {} };[].forEach.call(c, function (a) { f = a.getAttribute("highcharts-data-name"); (e = a.getAttribute("highcharts-data-series-id")) ? g.seriesId = a.value : f ? g.fields[f] = a.value : g.type = a.value }); a && (g.fields["params.volumeSeriesID"] = a.getAttribute("value")); return g
                }, showPopup: function () {
                    var a = this.container, b = a.querySelectorAll(".highcharts-popup-close")[0]; a.innerHTML = ""; 0 <= a.className.indexOf("highcharts-annotation-toolbar") && (a.classList.remove("highcharts-annotation-toolbar"),
                        a.removeAttribute("style")); a.appendChild(b); a.style.display = "block"
                }, closePopup: function () { this.popup.container.style.display = "none" }, showForm: function (a, b, c, d) { this.popup = b.navigationBindings.popup; this.showPopup(); "indicators" === a && this.indicators.addForm.call(this, b, c, d); "annotation-toolbar" === a && this.annotations.addToolbar.call(this, b, c, d); "annotation-edit" === a && this.annotations.addForm.call(this, b, c, d); "flag" === a && this.annotations.addForm.call(this, b, c, d, !0) }, getLangpack: function () { return e.getOptions().lang.navigation.popup },
                annotations: {
                    addToolbar: function (a, b, c) {
                        var d = this, e = this.lang, f = this.popup.container, h = this.showForm; -1 === f.className.indexOf("highcharts-annotation-toolbar") && (f.className += " highcharts-annotation-toolbar"); f.style.top = a.plotTop + 10 + "px"; g("span", { innerHTML: p(e[b.langKey] || b.langKey, b.shapes && b.shapes[0].type) }, null, f); var l = this.addButton(f, e.removeButton || "remove", "remove", c, f); l.className += " highcharts-annotation-remove-button"; l.style["background-image"] = "url(" + this.iconsURL + "destroy.svg)"; l =
                            this.addButton(f, e.editButton || "edit", "edit", function () { h.call(d, "annotation-edit", a, b, c) }, f); l.className += " highcharts-annotation-edit-button"; l.style["background-image"] = "url(" + this.iconsURL + "edit.svg)"
                    }, addForm: function (a, b, c, d) {
                        var e = this.popup.container, f = this.lang; g("h2", { innerHTML: f[b.langKey] || b.langKey, className: "highcharts-popup-main-title" }, null, e); var h = g("div", { className: "highcharts-popup-lhs-col highcharts-popup-lhs-full" }, null, e); var l = g("div", { className: "highcharts-popup-bottom-row" },
                            null, e); this.annotations.addFormFields.call(this, h, a, "", b, [], !0); this.addButton(l, d ? f.addButton || "add" : f.saveButton || "save", d ? "add" : "save", c, e)
                    }, addFormFields: function (b, d, e, f, k, r) {
                        var h = this, l = this.annotations.addFormFields, n = this.addInput, p = this.lang, w, u; a(f, function (a, f) { w = "" !== e ? e + "." + f : f; c(a) && (!m(a) || m(a) && c(a[0]) ? (u = p[f] || f, u.match(q) || k.push([!0, u, b]), l.call(h, b, d, w, a, k, !1)) : k.push([h, w, "annotation", b, a])) }); r && (k = k.sort(function (a) { return a[1].match(/format/g) ? -1 : 1 }), k.forEach(function (a) {
                        !0 ===
                            a[0] ? g("span", { className: "highcharts-annotation-title", innerHTML: a[1] }, null, a[2]) : n.apply(a[0], a.splice(1))
                        }))
                    }
                }, indicators: {
                    addForm: function (a, b, c) {
                        var d = this.indicators, e = this.lang; this.tabs.init.call(this, a); b = this.popup.container.querySelectorAll(".highcharts-tab-item-content"); this.addColsContainer(b[0]); d.addIndicatorList.call(this, a, b[0], "add"); var f = b[0].querySelectorAll(".highcharts-popup-rhs-col")[0]; this.addButton(f, e.addButton || "add", "add", c, f); this.addColsContainer(b[1]); d.addIndicatorList.call(this,
                            a, b[1], "edit"); f = b[1].querySelectorAll(".highcharts-popup-rhs-col")[0]; this.addButton(f, e.saveButton || "save", "edit", c, f); this.addButton(f, e.removeButton || "remove", "remove", c, f)
                    }, addIndicatorList: function (c, d, e) {
                        var f = this, h = d.querySelectorAll(".highcharts-popup-lhs-col")[0]; d = d.querySelectorAll(".highcharts-popup-rhs-col")[0]; var l = "edit" === e, k = l ? c.series : c.options.plotOptions, m = this.indicators.addFormFields, p; var w = g("ul", { className: "highcharts-indicator-list" }, null, h); var q = d.querySelectorAll(".highcharts-popup-rhs-col-wrapper")[0];
                        a(k, function (a, d) { var e = a.options; if (a.params || e && e.params) { var h = f.indicators.getNameType(a, d), n = h.type; p = g("li", { className: "highcharts-indicator-list", innerHTML: h.name }, null, w);["click", "touchstart"].forEach(function (d) { b(p, d, function () { m.call(f, c, l ? a : k[n], h.type, q); l && a.options && g("input", { type: "hidden", name: "highcharts-id-" + n, value: a.options.id }, null, q).setAttribute("highcharts-data-series-id", a.options.id) }) }) } }); 0 < w.childNodes.length && w.childNodes[0].click()
                    }, getNameType: function (a, b) {
                        var c =
                            a.options, d = e.seriesTypes; d = d[b] && d[b].prototype.nameBase || b.toUpperCase(); c && c.type && (b = a.options.type, d = a.name); return { name: d, type: b }
                    }, listAllSeries: function (a, b, c, d, e) {
                        a = "highcharts-" + b + "-type-" + a; var f; g("label", { innerHTML: this.lang[b] || b, htmlFor: a }, null, d); var h = g("select", { name: a, className: "highcharts-popup-field" }, null, d); h.setAttribute("id", "highcharts-select-" + b); c.series.forEach(function (a) {
                            f = a.options; !f.params && f.id && "highcharts-navigator-series" !== f.id && g("option", {
                                innerHTML: f.name ||
                                    f.id, value: f.id
                            }, null, h)
                        }); k(e) && (h.value = e)
                    }, addFormFields: function (a, b, c, d) {
                        var e = b.params || b.options.params, f = this.indicators.getNameType; d.innerHTML = ""; g("h3", { className: "highcharts-indicator-title", innerHTML: f(b, c).name }, null, d); g("input", { type: "hidden", name: "highcharts-type-" + c, value: c }, null, d); this.indicators.listAllSeries.call(this, c, "series", a, d, b.linkedParent && e.volumeSeriesID); e.volumeSeriesID && this.indicators.listAllSeries.call(this, c, "volume", a, d, b.linkedParent && b.linkedParent.options.id);
                        this.indicators.addParamInputs.call(this, a, "params", e, c, d)
                    }, addParamInputs: function (b, d, e, f, g) { var h = this, k = this.indicators.addParamInputs, l = this.addInput, m; a(e, function (a, e) { m = d + "." + e; c(a) ? k.call(h, b, m, a, f, g) : "params.volumeSeriesID" !== m && l.call(h, m, f, g, [a, "text"]) }) }, getAmount: function () { var b = 0; a(this.series, function (a) { var c = a.options; (a.params || c && c.params) && b++ }); return b }
                }, tabs: {
                    init: function (a) {
                        var b = this.tabs; a = this.indicators.getAmount.call(a); var c = b.addMenuItem.call(this, "add"); b.addMenuItem.call(this,
                            "edit", a); b.addContentItem.call(this, "add"); b.addContentItem.call(this, "edit"); b.switchTabs.call(this, a); b.selectTab.call(this, c, 0)
                    }, addMenuItem: function (a, b) { var c = this.popup.container, d = "highcharts-tab-item", e = this.lang; 0 === b && (d += " highcharts-tab-disabled"); b = g("span", { innerHTML: e[a + "Button"] || a, className: d }, null, c); b.setAttribute("highcharts-data-tab-type", a); return b }, addContentItem: function () { return g("div", { className: "highcharts-tab-item-content" }, null, this.popup.container) }, switchTabs: function (a) {
                        var c =
                            this, d; this.popup.container.querySelectorAll(".highcharts-tab-item").forEach(function (e, f) { d = e.getAttribute("highcharts-data-tab-type"); "edit" === d && 0 === a || ["click", "touchstart"].forEach(function (a) { b(e, a, function () { c.tabs.deselectAll.call(c); c.tabs.selectTab.call(c, this, f) }) }) })
                    }, selectTab: function (a, b) { var c = this.popup.container.querySelectorAll(".highcharts-tab-item-content"); a.className += " highcharts-tab-item-active"; c[b].className += " highcharts-tab-item-show" }, deselectAll: function () {
                        var a = this.popup.container,
                        b = a.querySelectorAll(".highcharts-tab-item"); a = a.querySelectorAll(".highcharts-tab-item-content"); var c; for (c = 0; c < b.length; c++)b[c].classList.remove("highcharts-tab-item-active"), a[c].classList.remove("highcharts-tab-item-show")
                    }
                }
            }; b(e.NavigationBindings, "showPopup", function (a) {
            this.popup || (this.popup = new e.Popup(this.chart.container, this.chart.options.navigation.iconsURL || this.chart.options.stockTools && this.chart.options.stockTools.gui.iconsURL || "https://code.highcharts.com/7.1.3/gfx/stock-icons/"));
                this.popup.showForm(a.formType, this.chart, a.options, a.onSubmit)
            }); b(e.NavigationBindings, "closePopup", function () { this.popup && this.popup.closePopup() })
    }); v(f, "masters/modules/annotations-advanced.src.js", [], function () { })
});
//# sourceMappingURL=annotations-advanced.js.map