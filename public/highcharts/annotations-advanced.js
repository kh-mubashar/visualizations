/*
 Highcharts JS v7.2.0 (2019-09-03)

 Annotations module

 (c) 2009-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(e) {
    "object" === typeof module && module.exports ? (e["default"] = e, module.exports = e) : "function" === typeof define && define.amd ? define("highcharts/modules/annotations-advanced", ["highcharts"], function(r) {
        e(r);
        e.Highcharts = r;
        return e
    }) : e("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function(e) {
    function r(f, h, e, m) {
        f.hasOwnProperty(h) || (f[h] = m.apply(null, e))
    }
    e = e ? e._modules : {};
    r(e, "annotations/eventEmitterMixin.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function(f, h) {
        var e = h.objectEach,
            m = f.fireEvent;
        return {
            addEvents: function() {
                var c = this;
                f.addEvent(c.graphic.element, "mousedown", function(d) {
                    c.onMouseDown(d)
                });
                e(c.options.events, function(d, a) {
                    var b = function(b) {
                        "click" === a && c.cancelClick || d.call(c, c.chart.pointer.normalize(b), c.target)
                    };
                    if (-1 === f.inArray(a, c.nonDOMEvents || [])) c.graphic.on(a, b);
                    else f.addEvent(c, a, b)
                });
                c.options.draggable && (f.addEvent(c, "drag", c.onDrag), c.graphic.renderer.styledMode || c.graphic.css({
                    cursor: {
                        x: "ew-resize",
                        y: "ns-resize",
                        xy: "move"
                    }[c.options.draggable]
                }));
                c.isUpdating || m(c, "add")
            },
            removeDocEvents: function() {
                this.removeDrag && (this.removeDrag = this.removeDrag());
                this.removeMouseUp && (this.removeMouseUp = this.removeMouseUp())
            },
            onMouseDown: function(c) {
                var d = this,
                    a = d.chart.pointer;
                c.preventDefault && c.preventDefault();
                if (2 !== c.button) {
                    c = a.normalize(c);
                    var b = c.chartX;
                    var g = c.chartY;
                    d.cancelClick = !1;
                    d.removeDrag = f.addEvent(f.doc, "mousemove", function(p) {
                        d.hasDragged = !0;
                        p = a.normalize(p);
                        p.prevChartX = b;
                        p.prevChartY = g;
                        m(d, "drag", p);
                        b = p.chartX;
                        g = p.chartY
                    });
                    d.removeMouseUp =
                        f.addEvent(f.doc, "mouseup", function(b) {
                            d.cancelClick = d.hasDragged;
                            d.hasDragged = !1;
                            m(f.pick(d.target, d), "afterUpdate");
                            d.onMouseUp(b)
                        })
                }
            },
            onMouseUp: function() {
                var c = this.chart,
                    d = this.target || this,
                    a = c.options.annotations;
                c = c.annotations.indexOf(d);
                this.removeDocEvents();
                a[c] = d.options
            },
            onDrag: function(c) {
                if (this.chart.isInsidePlot(c.chartX - this.chart.plotLeft, c.chartY - this.chart.plotTop)) {
                    var d = this.mouseMoveToTranslation(c);
                    "x" === this.options.draggable && (d.y = 0);
                    "y" === this.options.draggable && (d.x = 0);
                    this.points.length ? this.translate(d.x, d.y) : (this.shapes.forEach(function(a) {
                        a.translate(d.x, d.y)
                    }), this.labels.forEach(function(a) {
                        a.translate(d.x, d.y)
                    }));
                    this.redraw(!1)
                }
            },
            mouseMoveToRadians: function(c, d, a) {
                var b = c.prevChartY - a,
                    g = c.prevChartX - d;
                a = c.chartY - a;
                c = c.chartX - d;
                this.chart.inverted && (d = g, g = b, b = d, d = c, c = a, a = d);
                return Math.atan2(a, c) - Math.atan2(b, g)
            },
            mouseMoveToTranslation: function(c) {
                var d = c.chartX - c.prevChartX;
                c = c.chartY - c.prevChartY;
                if (this.chart.inverted) {
                    var a = c;
                    c = d;
                    d = a
                }
                return {
                    x: d,
                    y: c
                }
            },
            mouseMoveToScale: function(c, d, a) {
                d = (c.chartX - d || 1) / (c.prevChartX - d || 1);
                c = (c.chartY - a || 1) / (c.prevChartY - a || 1);
                this.chart.inverted && (a = c, c = d, d = a);
                return {
                    x: d,
                    y: c
                }
            },
            destroy: function() {
                this.removeDocEvents();
                f.removeEvent(this);
                this.hcEvents = null
            }
        }
    });
    r(e, "annotations/ControlPoint.js", [e["parts/Globals.js"], e["annotations/eventEmitterMixin.js"]], function(f, h) {
        function e(h, c, d, a) {
            this.chart = h;
            this.target = c;
            this.options = d;
            this.index = f.pick(d.index, a)
        }
        f.extend(e.prototype, h);
        e.prototype.nonDOMEvents = ["drag"];
        e.prototype.setVisibility = function(f) {
            this.graphic.attr("visibility", f ? "visible" : "hidden");
            this.options.visible = f
        };
        e.prototype.render = function() {
            var f = this.chart,
                c = this.options;
            this.graphic = f.renderer.symbol(c.symbol, 0, 0, c.width, c.height).add(f.controlPointsGroup).css(c.style);
            this.setVisibility(c.visible);
            this.addEvents()
        };
        e.prototype.redraw = function(f) {
            this.graphic[f ? "animate" : "attr"](this.options.positioner.call(this, this.target))
        };
        e.prototype.destroy = function() {
            h.destroy.call(this);
            this.graphic &&
                (this.graphic = this.graphic.destroy());
            this.options = this.target = this.chart = null
        };
        e.prototype.update = function(h) {
            var c = this.chart,
                d = this.target,
                a = this.index;
            h = f.merge(!0, this.options, h);
            this.destroy();
            this.constructor(c, d, h, a);
            this.render(c.controlPointsGroup);
            this.redraw()
        };
        return e
    });
    r(e, "annotations/MockPoint.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function(f, h) {
        function e(c, d, a) {
            this.series = {
                visible: !0,
                chart: c,
                getPlotBox: f.Series.prototype.getPlotBox
            };
            this.target = d || null;
            this.options =
                a;
            this.applyOptions(this.getOptions())
        }
        var m = h.defined;
        e.fromPoint = function(c) {
            return new e(c.series.chart, null, {
                x: c.x,
                y: c.y,
                xAxis: c.series.xAxis,
                yAxis: c.series.yAxis
            })
        };
        e.pointToPixels = function(c, d) {
            var a = c.series,
                b = a.chart,
                g = c.plotX,
                p = c.plotY;
            b.inverted && (c.mock ? (g = c.plotY, p = c.plotX) : (g = b.plotWidth - c.plotY, p = b.plotHeight - c.plotX));
            a && !d && (c = a.getPlotBox(), g += c.translateX, p += c.translateY);
            return {
                x: g,
                y: p
            }
        };
        e.pointToOptions = function(c) {
            return {
                x: c.x,
                y: c.y,
                xAxis: c.series.xAxis,
                yAxis: c.series.yAxis
            }
        };
        f.extend(e.prototype, {
            mock: !0,
            hasDynamicOptions: function() {
                return "function" === typeof this.options
            },
            getOptions: function() {
                return this.hasDynamicOptions() ? this.options(this.target) : this.options
            },
            applyOptions: function(c) {
                this.command = c.command;
                this.setAxis(c, "x");
                this.setAxis(c, "y");
                this.refresh()
            },
            setAxis: function(c, d) {
                d += "Axis";
                c = c[d];
                var a = this.series.chart;
                this.series[d] = c instanceof f.Axis ? c : m(c) ? a[d][c] || a.get(c) : null
            },
            toAnchor: function() {
                var c = [this.plotX, this.plotY, 0, 0];
                this.series.chart.inverted &&
                    (c[0] = this.plotY, c[1] = this.plotX);
                return c
            },
            getLabelConfig: function() {
                return {
                    x: this.x,
                    y: this.y,
                    point: this
                }
            },
            isInsidePane: function() {
                var c = this.plotX,
                    d = this.plotY,
                    a = this.series.xAxis,
                    b = this.series.yAxis,
                    g = !0;
                a && (g = m(c) && 0 <= c && c <= a.len);
                b && (g = g && m(d) && 0 <= d && d <= b.len);
                return g
            },
            refresh: function() {
                var c = this.series,
                    d = c.xAxis;
                c = c.yAxis;
                var a = this.getOptions();
                d ? (this.x = a.x, this.plotX = d.toPixels(a.x, !0)) : (this.x = null, this.plotX = a.x);
                c ? (this.y = a.y, this.plotY = c.toPixels(a.y, !0)) : (this.y = null, this.plotY = a.y);
                this.isInside = this.isInsidePane()
            },
            translate: function(c, d, a, b) {
                this.hasDynamicOptions() || (this.plotX += a, this.plotY += b, this.refreshOptions())
            },
            scale: function(c, d, a, b) {
                if (!this.hasDynamicOptions()) {
                    var g = this.plotY * b;
                    this.plotX = (1 - a) * c + this.plotX * a;
                    this.plotY = (1 - b) * d + g;
                    this.refreshOptions()
                }
            },
            rotate: function(c, d, a) {
                if (!this.hasDynamicOptions()) {
                    var b = Math.cos(a);
                    a = Math.sin(a);
                    var g = this.plotX,
                        p = this.plotY;
                    g -= c;
                    p -= d;
                    this.plotX = g * b - p * a + c;
                    this.plotY = g * a + p * b + d;
                    this.refreshOptions()
                }
            },
            refreshOptions: function() {
                var c =
                    this.series,
                    d = c.xAxis;
                c = c.yAxis;
                this.x = this.options.x = d ? this.options.x = d.toValue(this.plotX, !0) : this.plotX;
                this.y = this.options.y = c ? c.toValue(this.plotY, !0) : this.plotY
            }
        });
        return e
    });
    r(e, "annotations/controllable/controllableMixin.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["annotations/ControlPoint.js"], e["annotations/MockPoint.js"]], function(f, h, e, m) {
        var c = h.isObject,
            d = h.isString,
            a = h.splat;
        return {
            init: function(b, g, a) {
                this.annotation = b;
                this.chart = b.chart;
                this.options = g;
                this.points = [];
                this.controlPoints = [];
                this.index = a;
                this.linkPoints();
                this.addControlPoints()
            },
            attr: function() {
                this.graphic.attr.apply(this.graphic, arguments)
            },
            getPointsOptions: function() {
                var b = this.options;
                return b.points || b.point && a(b.point)
            },
            attrsFromOptions: function(b) {
                var g = this.constructor.attrsMap,
                    a = {},
                    c, k = this.chart.styledMode;
                for (c in b) {
                    var l = g[c];
                    !l || k && -1 !== ["fill", "stroke", "stroke-width"].indexOf(l) || (a[l] = b[c])
                }
                return a
            },
            anchor: function(b) {
                var g = b.series.getPlotBox();
                b = b.mock ? b.toAnchor() : f.Tooltip.prototype.getAnchor.call({
                        chart: b.series.chart
                    },
                    b);
                b = {
                    x: b[0] + (this.options.x || 0),
                    y: b[1] + (this.options.y || 0),
                    height: b[2] || 0,
                    width: b[3] || 0
                };
                return {
                    relativePosition: b,
                    absolutePosition: f.merge(b, {
                        x: b.x + g.translateX,
                        y: b.y + g.translateY
                    })
                }
            },
            point: function(b, g) {
                if (b && b.series) return b;
                g && null !== g.series || (c(b) ? g = new m(this.chart, this, b) : d(b) ? g = this.chart.get(b) || null : "function" === typeof b && (g = b.call(g, this), g = g.series ? g : new m(this.chart, this, b)));
                return g
            },
            linkPoints: function() {
                var b = this.getPointsOptions(),
                    g = this.points,
                    a = b && b.length || 0,
                    c;
                for (c = 0; c < a; c++) {
                    var k =
                        this.point(b[c], g[c]);
                    if (!k) {
                        g.length = 0;
                        return
                    }
                    k.mock && k.refresh();
                    g[c] = k
                }
                return g
            },
            addControlPoints: function() {
                var b = this.options.controlPoints;
                (b || []).forEach(function(g, a) {
                    g = f.merge(this.options.controlPointOptions, g);
                    g.index || (g.index = a);
                    b[a] = g;
                    this.controlPoints.push(new e(this.chart, this, g))
                }, this)
            },
            shouldBeDrawn: function() {
                return !!this.points.length
            },
            render: function() {
                this.controlPoints.forEach(function(b) {
                    b.render()
                })
            },
            redraw: function(b) {
                this.controlPoints.forEach(function(a) {
                    a.redraw(b)
                })
            },
            transform: function(b, a, c, d, k) {
                if (this.chart.inverted) {
                    var g = a;
                    a = c;
                    c = g
                }
                this.points.forEach(function(g, p) {
                    this.transformPoint(b, a, c, d, k, p)
                }, this)
            },
            transformPoint: function(b, a, c, d, k, l) {
                var g = this.points[l];
                g.mock || (g = this.points[l] = m.fromPoint(g));
                g[b](a, c, d, k)
            },
            translate: function(b, a) {
                this.transform("translate", null, null, b, a)
            },
            translatePoint: function(b, a, c) {
                this.transformPoint("translate", null, null, b, a, c)
            },
            translateShape: function(b, a) {
                var g = this.annotation.chart,
                    c = this.annotation.userOptions,
                    k = g.annotations.indexOf(this.annotation);
                g = g.options.annotations[k];
                this.translatePoint(b, a, 0);
                g[this.collection][this.index].point = this.options.point;
                c[this.collection][this.index].point = this.options.point
            },
            rotate: function(b, a, c) {
                this.transform("rotate", b, a, c)
            },
            scale: function(b, a, c, d) {
                this.transform("scale", b, a, c, d)
            },
            setControlPointsVisibility: function(b) {
                this.controlPoints.forEach(function(a) {
                    a.setVisibility(b)
                })
            },
            destroy: function() {
                this.graphic && (this.graphic = this.graphic.destroy());
                this.tracker && (this.tracker = this.tracker.destroy());
                this.controlPoints.forEach(function(b) {
                    b.destroy()
                });
                this.options = this.controlPoints = this.points = this.chart = null;
                this.annotation && (this.annotation = null)
            },
            update: function(b) {
                var a = this.annotation;
                b = f.merge(!0, this.options, b);
                var c = this.graphic.parentGroup;
                this.destroy();
                this.constructor(a, b);
                this.render(c);
                this.redraw()
            }
        }
    });
    r(e, "annotations/controllable/markerMixin.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function(f, h) {
        var e = h.defined,
            m = h.objectEach,
            c = h.splat,
            d = {
                arrow: {
                    tagName: "marker",
                    render: !1,
                    id: "arrow",
                    refY: 5,
                    refX: 9,
                    markerWidth: 10,
                    markerHeight: 10,
                    children: [{
                        tagName: "path",
                        d: "M 0 0 L 10 5 L 0 10 Z",
                        strokeWidth: 0
                    }]
                },
                "reverse-arrow": {
                    tagName: "marker",
                    render: !1,
                    id: "reverse-arrow",
                    refY: 5,
                    refX: 1,
                    markerWidth: 10,
                    markerHeight: 10,
                    children: [{
                        tagName: "path",
                        d: "M 0 5 L 10 0 L 10 10 Z",
                        strokeWidth: 0
                    }]
                }
            };
        f.SVGRenderer.prototype.addMarker = function(a, b) {
            var g = {
                    id: a
                },
                c = {
                    stroke: b.color || "none",
                    fill: b.color || "rgba(0, 0, 0, 0.75)"
                };
            g.children = b.children.map(function(b) {
                return f.merge(c, b)
            });
            b = this.definition(f.merge(!0, {
                markerWidth: 20,
                markerHeight: 20,
                refX: 0,
                refY: 0,
                orient: "auto"
            }, b, g));
            b.id = a;
            return b
        };
        h = function(a) {
            return function(b) {
                this.attr(a, "url(#" + b + ")")
            }
        };
        h = {
            markerEndSetter: h("marker-end"),
            markerStartSetter: h("marker-start"),
            setItemMarkers: function(a) {
                var b = a.options,
                    g = a.chart,
                    c = g.options.defs,
                    d = b.fill,
                    k = e(d) && "none" !== d ? d : b.stroke;
                ["markerStart", "markerEnd"].forEach(function(l) {
                    var d = b[l],
                        p;
                    if (d) {
                        for (p in c) {
                            var q = c[p];
                            if (d === q.id && "marker" === q.tagName) {
                                var x = q;
                                break
                            }
                        }
                        x && (d = a[l] = g.renderer.addMarker((b.id ||
                            f.uniqueKey()) + "-" + x.id, f.merge(x, {
                            color: k
                        })), a.attr(l, d.attr("id")))
                    }
                })
            }
        };
        f.SVGRenderer.prototype.definition = function(a) {
            function b(a, d) {
                var k;
                c(a).forEach(function(a) {
                    var c = g.createElement(a.tagName),
                        l = {};
                    m(a, function(b, a) {
                        "tagName" !== a && "children" !== a && "textContent" !== a && (l[a] = b)
                    });
                    c.attr(l);
                    c.add(d || g.defs);
                    a.textContent && c.element.appendChild(f.doc.createTextNode(a.textContent));
                    b(a.children || [], c);
                    k = c
                });
                return k
            }
            var g = this;
            return b(a)
        };
        f.addEvent(f.Chart, "afterGetContainer", function() {
            this.options.defs =
                f.merge(d, this.options.defs || {});
            m(this.options.defs, function(a) {
                "marker" === a.tagName && !1 !== a.render && this.renderer.addMarker(a.id, a)
            }, this)
        });
        return h
    });
    r(e, "annotations/controllable/ControllablePath.js", [e["parts/Globals.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/markerMixin.js"]], function(f, h, e) {
        function m(c, a, b) {
            this.init(c, a, b);
            this.collection = "shapes"
        }
        var c = "rgba(192,192,192," + (f.svg ? .0001 : .002) + ")";
        m.attrsMap = {
            dashStyle: "dashstyle",
            strokeWidth: "stroke-width",
            stroke: "stroke",
            fill: "fill",
            zIndex: "zIndex"
        };
        f.merge(!0, m.prototype, h, {
            type: "path",
            setMarkers: e.setItemMarkers,
            toD: function() {
                var c = this.options.d;
                if (c) return "function" === typeof c ? c.call(this) : c;
                var a = this.points,
                    b = a.length,
                    g = b,
                    p = a[0],
                    f = g && this.anchor(p).absolutePosition,
                    k = 0,
                    l = 2;
                for (c = f && ["M", f.x, f.y]; ++k < b && g;) p = a[k], g = p.command || "L", f = this.anchor(p).absolutePosition, "Z" === g ? c[++l] = g : (g !== a[k - 1].command && (c[++l] = g), c[++l] = f.x, c[++l] = f.y), g = p.series.visible;
                return g ? this.chart.renderer.crispLine(c,
                    this.graphic.strokeWidth()) : null
            },
            shouldBeDrawn: function() {
                return h.shouldBeDrawn.call(this) || !!this.options.d
            },
            render: function(d) {
                var a = this.options,
                    b = this.attrsFromOptions(a);
                this.graphic = this.annotation.chart.renderer.path(["M", 0, 0]).attr(b).add(d);
                a.className && this.graphic.addClass(a.className);
                this.tracker = this.annotation.chart.renderer.path(["M", 0, 0]).addClass("highcharts-tracker-line").attr({
                    zIndex: 2
                }).add(d);
                this.annotation.chart.styledMode || this.tracker.attr({
                    "stroke-linejoin": "round",
                    stroke: c,
                    fill: c,
                    "stroke-width": this.graphic.strokeWidth() + 2 * a.snap
                });
                h.render.call(this);
                f.extend(this.graphic, {
                    markerStartSetter: e.markerStartSetter,
                    markerEndSetter: e.markerEndSetter
                });
                this.setMarkers(this)
            },
            redraw: function(c) {
                var a = this.toD(),
                    b = c ? "animate" : "attr";
                a ? (this.graphic[b]({
                    d: a
                }), this.tracker[b]({
                    d: a
                })) : (this.graphic.attr({
                    d: "M 0 -9000000000"
                }), this.tracker.attr({
                    d: "M 0 -9000000000"
                }));
                this.graphic.placed = this.tracker.placed = !!a;
                h.redraw.call(this, c)
            }
        });
        return m
    });
    r(e, "annotations/controllable/ControllableRect.js", [e["parts/Globals.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllablePath.js"]], function(f, h, e) {
        function m(c, d, a) {
            this.init(c, d, a);
            this.collection = "shapes"
        }
        m.attrsMap = f.merge(e.attrsMap, {
            width: "width",
            height: "height"
        });
        f.merge(!0, m.prototype, h, {
            type: "rect",
            translate: h.translateShape,
            render: function(c) {
                var d = this.attrsFromOptions(this.options);
                this.graphic = this.annotation.chart.renderer.rect(0, -9E9, 0, 0).attr(d).add(c);
                h.render.call(this)
            },
            redraw: function(c) {
                var d =
                    this.anchor(this.points[0]).absolutePosition;
                if (d) this.graphic[c ? "animate" : "attr"]({
                    x: d.x,
                    y: d.y,
                    width: this.options.width,
                    height: this.options.height
                });
                else this.attr({
                    x: 0,
                    y: -9E9
                });
                this.graphic.placed = !!d;
                h.redraw.call(this, c)
            }
        });
        return m
    });
    r(e, "annotations/controllable/ControllableCircle.js", [e["parts/Globals.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllablePath.js"]], function(f, h, e) {
        function m(c, d, a) {
            this.init(c, d, a);
            this.collection = "shapes"
        }
        m.attrsMap =
            f.merge(e.attrsMap, {
                r: "r"
            });
        f.merge(!0, m.prototype, h, {
            type: "circle",
            translate: h.translateShape,
            render: function(c) {
                var d = this.attrsFromOptions(this.options);
                this.graphic = this.annotation.chart.renderer.circle(0, -9E9, 0).attr(d).add(c);
                h.render.call(this)
            },
            redraw: function(c) {
                var d = this.anchor(this.points[0]).absolutePosition;
                if (d) this.graphic[c ? "animate" : "attr"]({
                    x: d.x,
                    y: d.y,
                    r: this.options.r
                });
                else this.graphic.attr({
                    x: 0,
                    y: -9E9
                });
                this.graphic.placed = !!d;
                h.redraw.call(this, c)
            },
            setRadius: function(c) {
                this.options.r =
                    c
            }
        });
        return m
    });
    r(e, "annotations/controllable/ControllableLabel.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/MockPoint.js"]], function(f, h, e, m) {
        function c(a, b, g) {
            this.init(a, b, g);
            this.collection = "labels"
        }
        var d = h.isNumber;
        c.shapesWithoutBackground = ["connector"];
        c.alignedPosition = function(a, b) {
            var g = a.align,
                c = a.verticalAlign,
                d = (b.x || 0) + (a.x || 0),
                k = (b.y || 0) + (a.y || 0),
                l, f;
            "right" === g ? l = 1 : "center" === g && (l = 2);
            l && (d += (b.width - (a.width ||
                0)) / l);
            "bottom" === c ? f = 1 : "middle" === c && (f = 2);
            f && (k += (b.height - (a.height || 0)) / f);
            return {
                x: Math.round(d),
                y: Math.round(k)
            }
        };
        c.justifiedOptions = function(a, b, g, c) {
            var d = g.align,
                k = g.verticalAlign,
                l = b.box ? 0 : b.padding || 0,
                p = b.getBBox();
            b = {
                align: d,
                verticalAlign: k,
                x: g.x,
                y: g.y,
                width: b.width,
                height: b.height
            };
            g = c.x - a.plotLeft;
            var f = c.y - a.plotTop;
            c = g + l;
            0 > c && ("right" === d ? b.align = "left" : b.x = -c);
            c = g + p.width - l;
            c > a.plotWidth && ("left" === d ? b.align = "right" : b.x = a.plotWidth - c);
            c = f + l;
            0 > c && ("bottom" === k ? b.verticalAlign = "top" :
                b.y = -c);
            c = f + p.height - l;
            c > a.plotHeight && ("top" === k ? b.verticalAlign = "bottom" : b.y = a.plotHeight - c);
            return b
        };
        c.attrsMap = {
            backgroundColor: "fill",
            borderColor: "stroke",
            borderWidth: "stroke-width",
            zIndex: "zIndex",
            borderRadius: "r",
            padding: "padding"
        };
        f.merge(!0, c.prototype, e, {
            translatePoint: function(a, b) {
                e.translatePoint.call(this, a, b, 0)
            },
            translate: function(a, b) {
                var g = this.annotation.chart,
                    c = this.annotation.userOptions,
                    d = g.annotations.indexOf(this.annotation);
                d = g.options.annotations[d];
                g.inverted && (g = a, a = b,
                    b = g);
                this.options.x += a;
                this.options.y += b;
                d[this.collection][this.index].x = this.options.x;
                d[this.collection][this.index].y = this.options.y;
                c[this.collection][this.index].x = this.options.x;
                c[this.collection][this.index].y = this.options.y
            },
            render: function(a) {
                var b = this.options,
                    g = this.attrsFromOptions(b),
                    d = b.style;
                this.graphic = this.annotation.chart.renderer.label("", 0, -9999, b.shape, null, null, b.useHTML, null, "annotation-label").attr(g).add(a);
                this.annotation.chart.styledMode || ("contrast" === d.color && (d.color =
                    this.annotation.chart.renderer.getContrast(-1 < c.shapesWithoutBackground.indexOf(b.shape) ? "#FFFFFF" : b.backgroundColor)), this.graphic.css(b.style).shadow(b.shadow));
                b.className && this.graphic.addClass(b.className);
                this.graphic.labelrank = b.labelrank;
                e.render.call(this)
            },
            redraw: function(a) {
                var b = this.options,
                    g = this.text || b.format || b.text,
                    c = this.graphic,
                    d = this.points[0];
                c.attr({
                    text: g ? f.format(g, d.getLabelConfig(), this.annotation.chart.time) : b.formatter.call(d, this)
                });
                b = this.anchor(d);
                (g = this.position(b)) ?
                (c.alignAttr = g, g.anchorX = b.absolutePosition.x, g.anchorY = b.absolutePosition.y, c[a ? "animate" : "attr"](g)) : c.attr({
                    x: 0,
                    y: -9999
                });
                c.placed = !!g;
                e.redraw.call(this, a)
            },
            anchor: function() {
                var a = e.anchor.apply(this, arguments),
                    b = this.options.x || 0,
                    g = this.options.y || 0;
                a.absolutePosition.x -= b;
                a.absolutePosition.y -= g;
                a.relativePosition.x -= b;
                a.relativePosition.y -= g;
                return a
            },
            position: function(a) {
                var b = this.graphic,
                    g = this.annotation.chart,
                    d = this.points[0],
                    h = this.options,
                    k = a.absolutePosition,
                    l = a.relativePosition;
                if (a =
                    d.series.visible && m.prototype.isInsidePane.call(d)) {
                    if (h.distance) var e = f.Tooltip.prototype.getPosition.call({
                        chart: g,
                        distance: f.pick(h.distance, 16)
                    }, b.width, b.height, {
                        plotX: l.x,
                        plotY: l.y,
                        negative: d.negative,
                        ttBelow: d.ttBelow,
                        h: l.height || l.width
                    });
                    else h.positioner ? e = h.positioner.call(this) : (d = {
                        x: k.x,
                        y: k.y,
                        width: 0,
                        height: 0
                    }, e = c.alignedPosition(f.extend(h, {
                        width: b.width,
                        height: b.height
                    }), d), "justify" === this.options.overflow && (e = c.alignedPosition(c.justifiedOptions(g, b, h, e), d)));
                    h.crop && (h = e.x - g.plotLeft,
                        d = e.y - g.plotTop, a = g.isInsidePlot(h, d) && g.isInsidePlot(h + b.width, d + b.height))
                }
                return a ? e : null
            }
        });
        f.SVGRenderer.prototype.symbols.connector = function(a, b, g, c, f) {
            var k = f && f.anchorX;
            f = f && f.anchorY;
            var l = g / 2;
            if (d(k) && d(f)) {
                var p = ["M", k, f];
                var h = b - f;
                0 > h && (h = -c - h);
                h < g && (l = k < a + g / 2 ? h : g - h);
                f > b + c ? p.push("L", a + l, b + c) : f < b ? p.push("L", a + l, b) : k < a ? p.push("L", a, b + c / 2) : k > a + g && p.push("L", a + g, b + c / 2)
            }
            return p || []
        };
        return c
    });
    r(e, "annotations/controllable/ControllableImage.js", [e["parts/Globals.js"], e["annotations/controllable/controllableMixin.js"],
        e["annotations/controllable/ControllableLabel.js"]
    ], function(f, h, e) {
        function m(c, d, a) {
            this.init(c, d, a);
            this.collection = "shapes"
        }
        m.attrsMap = {
            width: "width",
            height: "height",
            zIndex: "zIndex"
        };
        f.merge(!0, m.prototype, h, {
            type: "image",
            translate: h.translateShape,
            render: function(c) {
                var d = this.attrsFromOptions(this.options),
                    a = this.options;
                this.graphic = this.annotation.chart.renderer.image(a.src, 0, -9E9, a.width, a.height).attr(d).add(c);
                this.graphic.width = a.width;
                this.graphic.height = a.height;
                h.render.call(this)
            },
            redraw: function(c) {
                var d = this.anchor(this.points[0]);
                if (d = e.prototype.position.call(this, d)) this.graphic[c ? "animate" : "attr"]({
                    x: d.x,
                    y: d.y
                });
                else this.graphic.attr({
                    x: 0,
                    y: -9E9
                });
                this.graphic.placed = !!d;
                h.redraw.call(this, c)
            }
        });
        return m
    });
    r(e, "annotations/annotations.src.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["annotations/controllable/controllableMixin.js"], e["annotations/controllable/ControllableRect.js"], e["annotations/controllable/ControllableCircle.js"], e["annotations/controllable/ControllablePath.js"],
        e["annotations/controllable/ControllableImage.js"], e["annotations/controllable/ControllableLabel.js"], e["annotations/eventEmitterMixin.js"], e["annotations/MockPoint.js"], e["annotations/ControlPoint.js"]
    ], function(f, h, e, m, c, d, a, b, g, p, x) {
        var k = h.defined,
            l = h.erase,
            v = h.splat,
            n = f.merge,
            q = f.addEvent,
            t = f.fireEvent,
            A = f.find,
            y = f.pick,
            z = f.reduce,
            B = f.destroyObjectProperties;
        h = f.Chart.prototype;
        var w = f.Annotation = function(b, a) {
            this.chart = b;
            this.points = [];
            this.controlPoints = [];
            this.coll = "annotations";
            this.labels = [];
            this.shapes = [];
            this.options = a;
            this.userOptions = n(!0, {}, a);
            var c = this.getLabelsAndShapesOptions(this.userOptions, a);
            this.userOptions.labels = c.labels;
            this.userOptions.shapes = c.shapes;
            this.init(b, a)
        };
        n(!0, w.prototype, e, g, {
            nonDOMEvents: ["add", "afterUpdate", "remove"],
            defaultOptions: {
                visible: !0,
                draggable: "xy",
                labelOptions: {
                    align: "center",
                    allowOverlap: !1,
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    borderColor: "black",
                    borderRadius: 3,
                    borderWidth: 1,
                    className: "",
                    crop: !1,
                    formatter: function() {
                        return k(this.y) ? this.y :
                            "Annotation label"
                    },
                    overflow: "justify",
                    padding: 5,
                    shadow: !1,
                    shape: "callout",
                    style: {
                        fontSize: "11px",
                        fontWeight: "normal",
                        color: "contrast"
                    },
                    useHTML: !1,
                    verticalAlign: "bottom",
                    x: 0,
                    y: -16
                },
                shapeOptions: {
                    stroke: "rgba(0, 0, 0, 0.75)",
                    strokeWidth: 1,
                    fill: "rgba(0, 0, 0, 0.75)",
                    r: 0,
                    snap: 2
                },
                controlPointOptions: {
                    symbol: "circle",
                    width: 10,
                    height: 10,
                    style: {
                        stroke: "black",
                        "stroke-width": 2,
                        fill: "white"
                    },
                    visible: !1,
                    events: {}
                },
                events: {},
                zIndex: 6
            },
            init: function() {
                this.linkPoints();
                this.addControlPoints();
                this.addShapes();
                this.addLabels();
                this.addClipPaths();
                this.setLabelCollector()
            },
            getLabelsAndShapesOptions: function(b, a) {
                var c = {};
                ["labels", "shapes"].forEach(function(g) {
                    b[g] && (c[g] = v(a[g]).map(function(a, c) {
                        return n(b[g][c], a)
                    }))
                });
                return c
            },
            addShapes: function() {
                (this.options.shapes || []).forEach(this.initShape, this)
            },
            addLabels: function() {
                (this.options.labels || []).forEach(this.initLabel, this)
            },
            addClipPaths: function() {
                this.setClipAxes();
                this.clipXAxis && this.clipYAxis && (this.clipRect = this.chart.renderer.clipRect(this.getClipBox()))
            },
            setClipAxes: function() {
                var b = this.chart.xAxis,
                    a = this.chart.yAxis,
                    c = z((this.options.labels || []).concat(this.options.shapes || []), function(c, g) {
                        return [b[g && g.point && g.point.xAxis] || c[0], a[g && g.point && g.point.yAxis] || c[1]]
                    }, []);
                this.clipXAxis = c[0];
                this.clipYAxis = c[1]
            },
            getClipBox: function() {
                return {
                    x: this.clipXAxis.left,
                    y: this.clipYAxis.top,
                    width: this.clipXAxis.width,
                    height: this.clipYAxis.height
                }
            },
            setLabelCollector: function() {
                var b = this;
                b.labelCollector = function() {
                    return b.labels.reduce(function(b, a) {
                        a.options.allowOverlap ||
                            b.push(a.graphic);
                        return b
                    }, [])
                };
                b.chart.labelCollectors.push(b.labelCollector)
            },
            setOptions: function(b) {
                this.options = n(this.defaultOptions, b)
            },
            redraw: function(b) {
                this.linkPoints();
                this.graphic || this.render();
                this.clipRect && this.clipRect.animate(this.getClipBox());
                this.redrawItems(this.shapes, b);
                this.redrawItems(this.labels, b);
                e.redraw.call(this, b)
            },
            redrawItems: function(b, a) {
                for (var c = b.length; c--;) this.redrawItem(b[c], a)
            },
            render: function() {
                var b = this.chart.renderer;
                this.graphic = b.g("annotation").attr({
                    zIndex: this.options.zIndex,
                    visibility: this.options.visible ? "visible" : "hidden"
                }).add();
                this.shapesGroup = b.g("annotation-shapes").add(this.graphic).clip(this.chart.plotBoxClip);
                this.labelsGroup = b.g("annotation-labels").attr({
                    translateX: 0,
                    translateY: 0
                }).add(this.graphic);
                this.clipRect && this.graphic.clip(this.clipRect);
                this.addEvents();
                e.render.call(this)
            },
            setVisibility: function(b) {
                var a = this.options;
                b = y(b, !a.visible);
                this.graphic.attr("visibility", b ? "visible" : "hidden");
                b || this.setControlPointsVisibility(!1);
                a.visible = b
            },
            setControlPointsVisibility: function(b) {
                var a =
                    function(a) {
                        a.setControlPointsVisibility(b)
                    };
                e.setControlPointsVisibility.call(this, b);
                this.shapes.forEach(a);
                this.labels.forEach(a)
            },
            destroy: function() {
                var b = this.chart,
                    a = function(b) {
                        b.destroy()
                    };
                this.labels.forEach(a);
                this.shapes.forEach(a);
                this.clipYAxis = this.clipXAxis = null;
                l(b.labelCollectors, this.labelCollector);
                g.destroy.call(this);
                e.destroy.call(this);
                B(this, b)
            },
            remove: function() {
                return this.chart.removeAnnotation(this)
            },
            update: function(b) {
                var a = this.chart,
                    c = this.getLabelsAndShapesOptions(this.userOptions,
                        b),
                    g = a.annotations.indexOf(this);
                b = f.merge(!0, this.userOptions, b);
                b.labels = c.labels;
                b.shapes = c.shapes;
                this.destroy();
                this.constructor(a, b);
                a.options.annotations[g] = b;
                this.isUpdating = !0;
                this.redraw();
                this.isUpdating = !1;
                t(this, "afterUpdate")
            },
            initShape: function(b, a) {
                b = n(this.options.shapeOptions, {
                    controlPointOptions: this.options.controlPointOptions
                }, b);
                a = new w.shapesMap[b.type](this, b, a);
                a.itemType = "shape";
                this.shapes.push(a);
                return a
            },
            initLabel: function(a, c) {
                a = n(this.options.labelOptions, {
                        controlPointOptions: this.options.controlPointOptions
                    },
                    a);
                c = new b(this, a, c);
                c.itemType = "label";
                this.labels.push(c);
                return c
            },
            redrawItem: function(b, a) {
                b.linkPoints();
                b.shouldBeDrawn() ? (b.graphic || this.renderItem(b), b.redraw(f.pick(a, !0) && b.graphic.placed), b.points.length && this.adjustVisibility(b)) : this.destroyItem(b)
            },
            adjustVisibility: function(b) {
                var a = !1,
                    c = b.graphic;
                b.points.forEach(function(b) {
                    !1 !== b.series.visible && !1 !== b.visible && (a = !0)
                });
                a ? "hidden" === c.visibility && c.show() : c.hide()
            },
            destroyItem: function(b) {
                l(this[b.itemType + "s"], b);
                b.destroy()
            },
            renderItem: function(b) {
                b.render("label" ===
                    b.itemType ? this.labelsGroup : this.shapesGroup)
            }
        });
        w.shapesMap = {
            rect: m,
            circle: c,
            path: d,
            image: a
        };
        w.types = {};
        w.MockPoint = p;
        w.ControlPoint = x;
        f.extendAnnotation = function(b, a, c, g) {
            a = a || w;
            n(!0, b.prototype, a.prototype, c);
            b.prototype.defaultOptions = n(b.prototype.defaultOptions, g || {})
        };
        f.extend(h, {
            initAnnotation: function(b) {
                var a = w.types[b.type] || w;
                b = f.merge(a.prototype.defaultOptions, b);
                a = new a(this, b);
                this.annotations.push(a);
                return a
            },
            addAnnotation: function(b, a) {
                b = this.initAnnotation(b);
                this.options.annotations.push(b.options);
                y(a, !0) && b.redraw();
                return b
            },
            removeAnnotation: function(b) {
                var a = this.annotations,
                    c = "annotations" === b.coll ? b : A(a, function(a) {
                        return a.options.id === b
                    });
                c && (t(c, "remove"), l(this.options.annotations, c.options), l(a, c), c.destroy())
            },
            drawAnnotations: function() {
                this.plotBoxClip.attr(this.plotBox);
                this.annotations.forEach(function(b) {
                    b.redraw()
                })
            }
        });
        h.collectionsWithUpdate.push("annotations");
        h.collectionsWithInit.annotations = [h.addAnnotation];
        h.callbacks.push(function(b) {
            b.annotations = [];
            b.options.annotations ||
                (b.options.annotations = []);
            b.plotBoxClip = this.renderer.clipRect(this.plotBox);
            b.controlPointsGroup = b.renderer.g("control-points").attr({
                zIndex: 99
            }).clip(b.plotBoxClip).add();
            b.options.annotations.forEach(function(a, c) {
                a = b.initAnnotation(a);
                b.options.annotations[c] = a.options
            });
            b.drawAnnotations();
            q(b, "redraw", b.drawAnnotations);
            q(b, "destroy", function() {
                b.plotBoxClip.destroy();
                b.controlPointsGroup.destroy()
            })
        })
    });
    r(e, "annotations/types/CrookedLine.js", [e["parts/Globals.js"]], function(f) {
        function h() {
            e.apply(this,
                arguments)
        }
        var e = f.Annotation,
            m = e.MockPoint,
            c = e.ControlPoint;
        f.extendAnnotation(h, null, {
            setClipAxes: function() {
                this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
                this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis]
            },
            getPointsOptions: function() {
                var c = this.options.typeOptions;
                return c.points.map(function(a) {
                    a.xAxis = c.xAxis;
                    a.yAxis = c.yAxis;
                    return a
                })
            },
            getControlPointsOptions: function() {
                return this.getPointsOptions()
            },
            addControlPoints: function() {
                this.getControlPointsOptions().forEach(function(d,
                    a) {
                    a = new c(this.chart, this, f.merge(this.options.controlPointOptions, d.controlPoint), a);
                    this.controlPoints.push(a);
                    d.controlPoint = a.options
                }, this)
            },
            addShapes: function() {
                var c = this.options.typeOptions,
                    a = this.initShape(f.merge(c.line, {
                        type: "path",
                        points: this.points.map(function(b, a) {
                            return function(b) {
                                return b.annotation.points[a]
                            }
                        })
                    }), !1);
                c.line = a.options
            }
        }, {
            typeOptions: {
                xAxis: 0,
                yAxis: 0,
                line: {
                    fill: "none"
                }
            },
            controlPointOptions: {
                positioner: function(c) {
                    var a = this.graphic;
                    c = m.pointToPixels(c.points[this.index]);
                    return {
                        x: c.x - a.width / 2,
                        y: c.y - a.height / 2
                    }
                },
                events: {
                    drag: function(c, a) {
                        a.chart.isInsidePlot(c.chartX - a.chart.plotLeft, c.chartY - a.chart.plotTop) && (c = this.mouseMoveToTranslation(c), a.translatePoint(c.x, c.y, this.index), a.options.typeOptions.points[this.index].x = a.points[this.index].x, a.options.typeOptions.points[this.index].y = a.points[this.index].y, a.redraw(!1))
                    }
                }
            }
        });
        return e.types.crookedLine = h
    });
    r(e, "annotations/types/ElliottWave.js", [e["parts/Globals.js"]], function(f) {
        function h() {
            m.apply(this, arguments)
        }
        var e = f.Annotation,
            m = e.types.crookedLine;
        f.extendAnnotation(h, m, {
            addLabels: function() {
                this.getPointsOptions().forEach(function(c, d) {
                    var a = this.initLabel(f.merge(c.label, {
                        text: this.options.typeOptions.labels[d],
                        point: function(b) {
                            return b.annotation.points[d]
                        }
                    }), !1);
                    c.label = a.options
                }, this)
            }
        }, {
            typeOptions: {
                labels: "(0) (A) (B) (C) (D) (E)".split(" "),
                line: {
                    strokeWidth: 1
                }
            },
            labelOptions: {
                align: "center",
                allowOverlap: !0,
                crop: !0,
                overflow: "none",
                type: "rect",
                backgroundColor: "none",
                borderWidth: 0,
                y: -5
            }
        });
        return e.types.elliottWave =
            h
    });
    r(e, "annotations/types/Tunnel.js", [e["parts/Globals.js"]], function(f) {
        function e() {
            m.apply(this, arguments)
        }
        var u = f.Annotation,
            m = u.types.crookedLine,
            c = u.ControlPoint,
            d = u.MockPoint;
        f.extendAnnotation(e, m, {
            getPointsOptions: function() {
                var a = m.prototype.getPointsOptions.call(this);
                a[2] = this.heightPointOptions(a[1]);
                a[3] = this.heightPointOptions(a[0]);
                return a
            },
            getControlPointsOptions: function() {
                return this.getPointsOptions().slice(0, 2)
            },
            heightPointOptions: function(a) {
                a = f.merge(a);
                a.y += this.options.typeOptions.height;
                return a
            },
            addControlPoints: function() {
                m.prototype.addControlPoints.call(this);
                var a = this.options,
                    b = new c(this.chart, this, f.merge(a.controlPointOptions, a.typeOptions.heightControlPoint), 2);
                this.controlPoints.push(b);
                a.typeOptions.heightControlPoint = b.options
            },
            addShapes: function() {
                this.addLine();
                this.addBackground()
            },
            addLine: function() {
                var a = this.initShape(f.merge(this.options.typeOptions.line, {
                    type: "path",
                    points: [this.points[0], this.points[1], function(b) {
                        b = d.pointToOptions(b.annotation.points[2]);
                        b.command = "M";
                        return b
                    }, this.points[3]]
                }), !1);
                this.options.typeOptions.line = a.options
            },
            addBackground: function() {
                var a = this.initShape(f.merge(this.options.typeOptions.background, {
                    type: "path",
                    points: this.points.slice()
                }));
                this.options.typeOptions.background = a.options
            },
            translateSide: function(a, b, c) {
                c = Number(c);
                var g = 0 === c ? 3 : 2;
                this.translatePoint(a, b, c);
                this.translatePoint(a, b, g)
            },
            translateHeight: function(a) {
                this.translatePoint(0, a, 2);
                this.translatePoint(0, a, 3);
                this.options.typeOptions.height = this.points[3].y -
                    this.points[0].y
            }
        }, {
            typeOptions: {
                xAxis: 0,
                yAxis: 0,
                background: {
                    fill: "rgba(130, 170, 255, 0.4)",
                    strokeWidth: 0
                },
                line: {
                    strokeWidth: 1
                },
                height: -2,
                heightControlPoint: {
                    positioner: function(a) {
                        var b = d.pointToPixels(a.points[2]);
                        a = d.pointToPixels(a.points[3]);
                        var c = (b.x + a.x) / 2;
                        return {
                            x: c - this.graphic.width / 2,
                            y: (a.y - b.y) / (a.x - b.x) * (c - b.x) + b.y - this.graphic.height / 2
                        }
                    },
                    events: {
                        drag: function(a, b) {
                            b.chart.isInsidePlot(a.chartX - b.chart.plotLeft, a.chartY - b.chart.plotTop) && (b.translateHeight(this.mouseMoveToTranslation(a).y),
                                b.redraw(!1))
                        }
                    }
                }
            },
            controlPointOptions: {
                events: {
                    drag: function(a, b) {
                        b.chart.isInsidePlot(a.chartX - b.chart.plotLeft, a.chartY - b.chart.plotTop) && (a = this.mouseMoveToTranslation(a), b.translateSide(a.x, a.y, this.index), b.redraw(!1))
                    }
                }
            }
        });
        return u.types.tunnel = e
    });
    r(e, "annotations/types/InfinityLine.js", [e["parts/Globals.js"]], function(f) {
        function e() {
            c.apply(this, arguments)
        }
        var u = f.Annotation,
            m = u.MockPoint,
            c = u.types.crookedLine;
        e.findEdgeCoordinate = function(a, b, c, d) {
            var g = "x" === c ? "y" : "x";
            return (b[c] - a[c]) *
                (d - a[g]) / (b[g] - a[g]) + a[c]
        };
        e.findEdgePoint = function(a, b) {
            var c = a.series.xAxis,
                d = b.series.yAxis,
                f = m.pointToPixels(a),
                k = m.pointToPixels(b),
                l = k.x - f.x,
                h = k.y - f.y;
            b = c.left;
            var n = b + c.width;
            c = d.top;
            d = c + d.height;
            var q = 0 > l ? b : n,
                t = 0 > h ? c : d;
            n = {
                x: 0 === l ? f.x : q,
                y: 0 === h ? f.y : t
            };
            0 !== l && 0 !== h && (l = e.findEdgeCoordinate(f, k, "y", q), f = e.findEdgeCoordinate(f, k, "x", t), l >= c && l <= d ? (n.x = q, n.y = l) : (n.x = f, n.y = t));
            n.x -= b;
            n.y -= c;
            a.series.chart.inverted && (a = n.x, n.x = n.y, n.y = a);
            return n
        };
        var d = function(a, b) {
            return function(c) {
                c = c.annotation;
                var g = c.points,
                    d = c.options.typeOptions.type;
                "horizontalLine" === d ? g = [g[0], new m(c.chart, g[0].target, {
                    x: g[0].x + 1,
                    y: g[0].y,
                    xAxis: g[0].options.xAxis,
                    yAxis: g[0].options.yAxis
                })] : "verticalLine" === d && (g = [g[0], new m(c.chart, g[0].target, {
                    x: g[0].x,
                    y: g[0].y + 1,
                    xAxis: g[0].options.xAxis,
                    yAxis: g[0].options.yAxis
                })]);
                return e.findEdgePoint(g[a], g[b])
            }
        };
        e.endEdgePoint = d(0, 1);
        e.startEdgePoint = d(1, 0);
        f.extendAnnotation(e, c, {
            addShapes: function() {
                var a = this.options.typeOptions,
                    b = [this.points[0], e.endEdgePoint];
                a.type.match(/Line/g) &&
                    (b[0] = e.startEdgePoint);
                b = this.initShape(f.merge(a.line, {
                    type: "path",
                    points: b
                }), !1);
                a.line = b.options
            }
        });
        return u.types.infinityLine = e
    });
    r(e, "annotations/types/Fibonacci.js", [e["parts/Globals.js"]], function(f) {
        function e() {
            this.startRetracements = [];
            this.endRetracements = [];
            c.apply(this, arguments)
        }
        var u = f.Annotation,
            m = u.MockPoint,
            c = u.types.tunnel,
            d = function(a, b) {
                return function() {
                    var c = this.annotation,
                        d = this.anchor(c.startRetracements[a]).absolutePosition,
                        f = this.anchor(c.endRetracements[a]).absolutePosition;
                    d = ["M", Math.round(d.x), Math.round(d.y), "L", Math.round(f.x), Math.round(f.y)];
                    b && (f = this.anchor(c.endRetracements[a - 1]).absolutePosition, c = this.anchor(c.startRetracements[a - 1]).absolutePosition, d.push("L", Math.round(f.x), Math.round(f.y), "L", Math.round(c.x), Math.round(c.y)));
                    return d
                }
            };
        e.levels = [0, .236, .382, .5, .618, .786, 1];
        f.extendAnnotation(e, c, {
            linkPoints: function() {
                c.prototype.linkPoints.call(this);
                this.linkRetracementsPoints()
            },
            linkRetracementsPoints: function() {
                var a = this.points,
                    b = a[0].y - a[3].y,
                    c = a[1].y - a[2].y,
                    d = a[0].x,
                    f = a[1].x;
                e.levels.forEach(function(g, l) {
                    var k = a[1].y - c * g;
                    this.linkRetracementPoint(l, d, a[0].y - b * g, this.startRetracements);
                    this.linkRetracementPoint(l, f, k, this.endRetracements)
                }, this)
            },
            linkRetracementPoint: function(a, b, c, d) {
                var g = d[a],
                    k = this.options.typeOptions;
                g ? (g.options.x = b, g.options.y = c, g.refresh()) : d[a] = new m(this.chart, this, {
                    x: b,
                    y: c,
                    xAxis: k.xAxis,
                    yAxis: k.yAxis
                })
            },
            addShapes: function() {
                e.levels.forEach(function(a, b) {
                    this.initShape({
                        type: "path",
                        d: d(b)
                    }, !1);
                    0 < b && this.initShape({
                        type: "path",
                        fill: this.options.typeOptions.backgroundColors[b - 1],
                        strokeWidth: 0,
                        d: d(b, !0)
                    })
                }, this)
            },
            addLabels: function() {
                e.levels.forEach(function(a, b) {
                    var c = this.options.typeOptions;
                    a = this.initLabel(f.merge(c.labels[b], {
                        point: function(a) {
                            return m.pointToOptions(a.annotation.startRetracements[b])
                        },
                        text: a.toString()
                    }));
                    c.labels[b] = a.options
                }, this)
            }
        }, {
            typeOptions: {
                height: 2,
                backgroundColors: "rgba(130, 170, 255, 0.4);rgba(139, 191, 216, 0.4);rgba(150, 216, 192, 0.4);rgba(156, 229, 161, 0.4);rgba(162, 241, 130, 0.4);rgba(169, 255, 101, 0.4)".split(";"),
                lineColor: "grey",
                lineColors: [],
                labels: []
            },
            labelOptions: {
                allowOverlap: !0,
                align: "right",
                backgroundColor: "none",
                borderWidth: 0,
                crop: !1,
                overflow: "none",
                shape: "rect",
                style: {
                    color: "grey"
                },
                verticalAlign: "middle",
                y: 0
            }
        });
        return u.types.fibonacci = e
    });
    r(e, "annotations/types/Pitchfork.js", [e["parts/Globals.js"]], function(f) {
        function e() {
            c.apply(this, arguments)
        }
        var u = f.Annotation,
            m = u.MockPoint,
            c = u.types.infinityLine;
        e.findEdgePoint = function(a, b, c) {
            b = Math.atan2(c.plotY - b.plotY, c.plotX - b.plotX);
            return {
                x: a.plotX +
                    1E7 * Math.cos(b),
                y: a.plotY + 1E7 * Math.sin(b)
            }
        };
        e.middleLineEdgePoint = function(a) {
            var b = a.annotation;
            return c.findEdgePoint(b.points[0], new m(b.chart, a, b.midPointOptions()))
        };
        var d = function(a) {
            return function(b) {
                var c = b.annotation,
                    d = c.points;
                return e.findEdgePoint(d[a], d[0], new m(c.chart, b, c.midPointOptions()))
            }
        };
        e.topLineEdgePoint = d(1);
        e.bottomLineEdgePoint = d(0);
        f.extendAnnotation(e, c, {
            midPointOptions: function() {
                var a = this.points;
                return {
                    x: (a[1].x + a[2].x) / 2,
                    y: (a[1].y + a[2].y) / 2,
                    xAxis: a[0].series.xAxis,
                    yAxis: a[0].series.yAxis
                }
            },
            addShapes: function() {
                this.addLines();
                this.addBackgrounds()
            },
            addLines: function() {
                this.initShape({
                    type: "path",
                    points: [this.points[0], e.middleLineEdgePoint]
                }, !1);
                this.initShape({
                    type: "path",
                    points: [this.points[1], e.topLineEdgePoint]
                }, !1);
                this.initShape({
                    type: "path",
                    points: [this.points[2], e.bottomLineEdgePoint]
                }, !1)
            },
            addBackgrounds: function() {
                var a = this.shapes,
                    b = this.options.typeOptions,
                    c = this.initShape(f.merge(b.innerBackground, {
                        type: "path",
                        points: [function(b) {
                            var a = b.annotation;
                            b = a.points;
                            a = a.midPointOptions();
                            return {
                                x: (b[1].x + a.x) / 2,
                                y: (b[1].y + a.y) / 2,
                                xAxis: a.xAxis,
                                yAxis: a.yAxis
                            }
                        }, a[1].points[1], a[2].points[1], function(b) {
                            var a = b.annotation;
                            b = a.points;
                            a = a.midPointOptions();
                            return {
                                x: (a.x + b[2].x) / 2,
                                y: (a.y + b[2].y) / 2,
                                xAxis: a.xAxis,
                                yAxis: a.yAxis
                            }
                        }]
                    }));
                a = this.initShape(f.merge(b.outerBackground, {
                    type: "path",
                    points: [this.points[1], a[1].points[1], a[2].points[1], this.points[2]]
                }));
                b.innerBackground = c.options;
                b.outerBackground = a.options
            }
        }, {
            typeOptions: {
                innerBackground: {
                    fill: "rgba(130, 170, 255, 0.4)",
                    strokeWidth: 0
                },
                outerBackground: {
                    fill: "rgba(156, 229, 161, 0.4)",
                    strokeWidth: 0
                }
            }
        });
        return u.types.pitchfork = e
    });
    r(e, "annotations/types/VerticalLine.js", [e["parts/Globals.js"]], function(f) {
        function e() {
            f.Annotation.apply(this, arguments)
        }
        var u = f.Annotation,
            m = u.MockPoint;
        e.connectorFirstPoint = function(c) {
            c = c.annotation;
            var d = c.points[0],
                a = m.pointToPixels(d, !0),
                b = a.y,
                g = c.options.typeOptions.label.offset;
            c.chart.inverted && (b = a.x);
            return {
                x: d.x,
                xAxis: d.series.xAxis,
                y: b + g
            }
        };
        e.connectorSecondPoint = function(c) {
            var d =
                c.annotation;
            c = d.options.typeOptions;
            var a = d.points[0],
                b = c.yOffset;
            d = m.pointToPixels(a, !0)[d.chart.inverted ? "x" : "y"];
            0 > c.label.offset && (b *= -1);
            return {
                x: a.x,
                xAxis: a.series.xAxis,
                y: d + b
            }
        };
        f.extendAnnotation(e, null, {
            getPointsOptions: function() {
                return [this.options.typeOptions.point]
            },
            addShapes: function() {
                var c = this.options.typeOptions,
                    d = this.initShape(f.merge(c.connector, {
                        type: "path",
                        points: [e.connectorFirstPoint, e.connectorSecondPoint]
                    }), !1);
                c.connector = d.options
            },
            addLabels: function() {
                var c = this.options.typeOptions,
                    d = c.label,
                    a = 0,
                    b = d.offset,
                    g = 0 > d.offset ? "bottom" : "top",
                    e = "center";
                this.chart.inverted && (a = d.offset, b = 0, g = "middle", e = 0 > d.offset ? "right" : "left");
                d = this.initLabel(f.merge(d, {
                    verticalAlign: g,
                    align: e,
                    x: a,
                    y: b
                }));
                c.label = d.options
            }
        }, {
            typeOptions: {
                yOffset: 10,
                label: {
                    offset: -40,
                    point: function(c) {
                        return c.annotation.points[0]
                    },
                    allowOverlap: !0,
                    backgroundColor: "none",
                    borderWidth: 0,
                    crop: !0,
                    overflow: "none",
                    shape: "rect",
                    text: "{y:.2f}"
                },
                connector: {
                    strokeWidth: 1,
                    markerEnd: "arrow"
                }
            }
        });
        return u.types.verticalLine = e
    });
    r(e, "annotations/types/Measure.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function(f, e) {
        function h() {
            c.apply(this, arguments)
        }
        var m = e.isNumber,
            c = f.Annotation,
            d = c.ControlPoint,
            a = f.merge;
        c.types.measure = h;
        f.extendAnnotation(h, null, {
            init: function() {
                c.prototype.init.apply(this, arguments);
                this.resizeY = this.resizeX = this.offsetY = this.offsetX = 0;
                this.calculations.init.call(this);
                this.addValues();
                this.addShapes()
            },
            setClipAxes: function() {
                this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
                this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis]
            },
            pointsOptions: function() {
                return this.options.options.points
            },
            shapePointsOptions: function() {
                var b = this.options.typeOptions,
                    a = b.xAxis;
                b = b.yAxis;
                return [{
                    x: this.xAxisMin,
                    y: this.yAxisMin,
                    xAxis: a,
                    yAxis: b
                }, {
                    x: this.xAxisMax,
                    y: this.yAxisMin,
                    xAxis: a,
                    yAxis: b
                }, {
                    x: this.xAxisMax,
                    y: this.yAxisMax,
                    xAxis: a,
                    yAxis: b
                }, {
                    x: this.xAxisMin,
                    y: this.yAxisMax,
                    xAxis: a,
                    yAxis: b
                }]
            },
            addControlPoints: function() {
                var b = this.options.typeOptions.selectType;
                var a = new d(this.chart,
                    this, this.options.controlPointOptions, 0);
                this.controlPoints.push(a);
                "xy" !== b && (a = new d(this.chart, this, this.options.controlPointOptions, 1), this.controlPoints.push(a))
            },
            addValues: function(b) {
                var a = this.options.typeOptions,
                    c = a.label.formatter;
                this.calculations.recalculate.call(this, b);
                a.label.enabled && (0 < this.labels.length ? this.labels[0].text = c && c.call(this) || this.calculations.defaultFormatter.call(this) : this.initLabel(f.extend({
                    shape: "rect",
                    backgroundColor: "none",
                    color: "black",
                    borderWidth: 0,
                    dashStyle: "dash",
                    overflow: "none",
                    align: "left",
                    vertical: "top",
                    crop: !0,
                    point: function(b) {
                        b = b.annotation;
                        var c = b.chart,
                            g = c.inverted,
                            d = c.yAxis[a.yAxis],
                            f = c.plotTop,
                            e = c.plotLeft;
                        return {
                            x: (g ? f : 10) + c.xAxis[a.xAxis].toPixels(b.xAxisMin, !g),
                            y: (g ? -e + 10 : f) + d.toPixels(b.yAxisMin)
                        }
                    },
                    text: c && c.call(this) || this.calculations.defaultFormatter.call(this)
                }, a.label)))
            },
            addShapes: function() {
                this.addCrosshairs();
                this.addBackground()
            },
            addBackground: function() {
                void 0 !== this.shapePointsOptions()[0].x && this.initShape(f.extend({
                    type: "path",
                    points: this.shapePointsOptions()
                }, this.options.typeOptions.background), !1)
            },
            addCrosshairs: function() {
                var b = this.chart,
                    c = this.options.typeOptions,
                    d = this.options.typeOptions.point,
                    e = b.xAxis[c.xAxis],
                    k = b.yAxis[c.yAxis],
                    l = b.inverted;
                b = e.toPixels(this.xAxisMin);
                e = e.toPixels(this.xAxisMax);
                var h = k.toPixels(this.yAxisMin),
                    n = k.toPixels(this.yAxisMax),
                    q = {
                        point: d,
                        type: "path"
                    };
                d = [];
                k = [];
                l && (l = b, b = h, h = l, l = e, e = n, n = l);
                c.crosshairX.enabled && (d = ["M", b, h + (n - h) / 2, "L", e, h + (n - h) / 2]);
                c.crosshairY.enabled && (k = ["M", b + (e -
                    b) / 2, h, "L", b + (e - b) / 2, n]);
                0 < this.shapes.length ? (this.shapes[0].options.d = d, this.shapes[1].options.d = k) : (b = a(q, c.crosshairX), c = a(q, c.crosshairY), this.initShape(f.extend({
                    d: d
                }, b), !1), this.initShape(f.extend({
                    d: k
                }, c), !1))
            },
            onDrag: function(b) {
                var a = this.mouseMoveToTranslation(b),
                    c = this.options.typeOptions.selectType;
                b = "y" === c ? 0 : a.x;
                a = "x" === c ? 0 : a.y;
                this.translate(b, a);
                this.offsetX += b;
                this.offsetY += a;
                this.redraw(!1, !1, !0)
            },
            resize: function(b, a, c, d) {
                var g = this.shapes[2];
                "x" === d ? 0 === c ? (g.translatePoint(b, 0,
                    0), g.translatePoint(b, a, 3)) : (g.translatePoint(b, 0, 1), g.translatePoint(b, a, 2)) : "y" === d ? 0 === c ? (g.translatePoint(0, a, 0), g.translatePoint(0, a, 1)) : (g.translatePoint(0, a, 2), g.translatePoint(0, a, 3)) : (g.translatePoint(b, 0, 1), g.translatePoint(b, a, 2), g.translatePoint(0, a, 3));
                this.calculations.updateStartPoints.call(this, !1, !0, c, b, a);
                this.options.typeOptions.background.height = Math.abs(this.startYMax - this.startYMin);
                this.options.typeOptions.background.width = Math.abs(this.startXMax - this.startXMin)
            },
            redraw: function(b,
                a, c) {
                this.linkPoints();
                this.graphic || this.render();
                c && this.calculations.updateStartPoints.call(this, !0, !1);
                this.clipRect && this.clipRect.animate(this.getClipBox());
                this.addValues(a);
                this.addCrosshairs();
                this.redrawItems(this.shapes, b);
                this.redrawItems(this.labels, b);
                this.controlPoints.forEach(function(b) {
                    b.redraw()
                })
            },
            translate: function(b, a) {
                this.shapes.forEach(function(c) {
                    c.translate(b, a)
                });
                this.options.typeOptions.point.x = this.startXMin;
                this.options.typeOptions.point.y = this.startYMin
            },
            calculations: {
                init: function() {
                    var b =
                        this.options.typeOptions,
                        a = this.chart,
                        c = this.calculations.getPointPos,
                        d = a.inverted,
                        f = a.xAxis[b.xAxis],
                        l = a.yAxis[b.yAxis],
                        e = b.background,
                        h = d ? e.height : e.width;
                    e = d ? e.width : e.height;
                    var q = b.selectType,
                        t = d ? a.plotLeft : a.plotTop;
                    a = d ? a.plotTop : a.plotLeft;
                    this.startXMin = b.point.x;
                    this.startYMin = b.point.y;
                    m(h) ? this.startXMax = this.startXMin + h : this.startXMax = c(f, this.startXMin, parseFloat(h));
                    m(e) ? this.startYMax = this.startYMin - e : this.startYMax = c(l, this.startYMin, parseFloat(e));
                    "x" === q ? (this.startYMin = l.toValue(t),
                        this.startYMax = l.toValue(t + l.len)) : "y" === q && (this.startXMin = f.toValue(a), this.startXMax = f.toValue(a + f.len))
                },
                recalculate: function(b) {
                    var a = this.calculations,
                        c = this.options.typeOptions,
                        d = this.chart.xAxis[c.xAxis];
                    c = this.chart.yAxis[c.yAxis];
                    var f = this.calculations.getPointPos,
                        e = this.offsetX,
                        h = this.offsetY;
                    this.xAxisMin = f(d, this.startXMin, e);
                    this.xAxisMax = f(d, this.startXMax, e);
                    this.yAxisMin = f(c, this.startYMin, h);
                    this.yAxisMax = f(c, this.startYMax, h);
                    this.min = a.min.call(this);
                    this.max = a.max.call(this);
                    this.average = a.average.call(this);
                    this.bins = a.bins.call(this);
                    b && this.resize(0, 0)
                },
                getPointPos: function(b, a, c) {
                    return b.toValue(b.toPixels(a) + c)
                },
                updateStartPoints: function(b, a, c, d, f) {
                    var g = this.options.typeOptions,
                        e = g.selectType,
                        k = this.chart.xAxis[g.xAxis];
                    g = this.chart.yAxis[g.yAxis];
                    var q = this.calculations.getPointPos,
                        t = this.startXMin,
                        h = this.startXMax,
                        y = this.startYMin,
                        z = this.startYMax,
                        p = this.offsetX,
                        m = this.offsetY;
                    a && ("x" === e ? 0 === c ? this.startXMin = q(k, t, d) : this.startXMax = q(k, h, d) : "y" === e ? 0 === c ? this.startYMin =
                        q(g, y, f) : this.startYMax = q(g, z, f) : (this.startXMax = q(k, h, d), this.startYMax = q(g, z, f)));
                    b && (this.startXMin = q(k, t, p), this.startXMax = q(k, h, p), this.startYMin = q(g, y, m), this.startYMax = q(g, z, m), this.offsetY = this.offsetX = 0)
                },
                defaultFormatter: function() {
                    return "Min: " + this.min + "<br>Max: " + this.max + "<br>Average: " + this.average + "<br>Bins: " + this.bins
                },
                getExtremes: function(b, a, c, d) {
                    return {
                        xAxisMin: Math.min(a, b),
                        xAxisMax: Math.max(a, b),
                        yAxisMin: Math.min(d, c),
                        yAxisMax: Math.max(d, c)
                    }
                },
                min: function() {
                    var b = Infinity,
                        a =
                        this.chart.series,
                        c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax),
                        d = !1;
                    a.forEach(function(a) {
                        a.visible && "highcharts-navigator-series" !== a.options.id && a.points.forEach(function(a) {
                            !a.isNull && a.y < b && a.x > c.xAxisMin && a.x <= c.xAxisMax && a.y > c.yAxisMin && a.y <= c.yAxisMax && (b = a.y, d = !0)
                        })
                    });
                    d || (b = "");
                    return b
                },
                max: function() {
                    var b = -Infinity,
                        a = this.chart.series,
                        c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax),
                        d = !1;
                    a.forEach(function(a) {
                        a.visible &&
                            "highcharts-navigator-series" !== a.options.id && a.points.forEach(function(a) {
                                !a.isNull && a.y > b && a.x > c.xAxisMin && a.x <= c.xAxisMax && a.y > c.yAxisMin && a.y <= c.yAxisMax && (b = a.y, d = !0)
                            })
                    });
                    d || (b = "");
                    return b
                },
                average: function() {
                    var b = "";
                    "" !== this.max && "" !== this.min && (b = (this.max + this.min) / 2);
                    return b
                },
                bins: function() {
                    var b = 0,
                        a = this.chart.series,
                        c = this.calculations.getExtremes(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax),
                        d = !1;
                    a.forEach(function(a) {
                        a.visible && "highcharts-navigator-series" !== a.options.id &&
                            a.points.forEach(function(a) {
                                !a.isNull && a.x > c.xAxisMin && a.x <= c.xAxisMax && a.y > c.yAxisMin && a.y <= c.yAxisMax && (b++, d = !0)
                            })
                    });
                    d || (b = "");
                    return b
                }
            }
        }, {
            typeOptions: {
                selectType: "xy",
                xAxis: 0,
                yAxis: 0,
                background: {
                    fill: "rgba(130, 170, 255, 0.4)",
                    strokeWidth: 0,
                    stroke: void 0
                },
                crosshairX: {
                    enabled: !0,
                    zIndex: 6,
                    dashStyle: "Dash",
                    markerEnd: "arrow"
                },
                crosshairY: {
                    enabled: !0,
                    zIndex: 6,
                    dashStyle: "Dash",
                    markerEnd: "arrow"
                },
                label: {
                    enabled: !0,
                    style: {
                        fontSize: "11px",
                        color: "#666666"
                    },
                    formatter: void 0
                }
            },
            controlPointOptions: {
                positioner: function(a) {
                    var b =
                        this.index,
                        c = a.chart,
                        d = a.options,
                        f = d.typeOptions,
                        e = f.selectType;
                    d = d.controlPointOptions;
                    var h = c.inverted,
                        n = c.xAxis[f.xAxis];
                    c = c.yAxis[f.yAxis];
                    f = a.xAxisMax;
                    var q = a.yAxisMax,
                        t = a.calculations.getExtremes(a.xAxisMin, a.xAxisMax, a.yAxisMin, a.yAxisMax);
                    "x" === e && (q = (t.yAxisMax - t.yAxisMin) / 2, 0 === b && (f = a.xAxisMin));
                    "y" === e && (f = t.xAxisMin + (t.xAxisMax - t.xAxisMin) / 2, 0 === b && (q = a.yAxisMin));
                    h ? (a = c.toPixels(q), b = n.toPixels(f)) : (a = n.toPixels(f), b = c.toPixels(q));
                    return {
                        x: a - d.width / 2,
                        y: b - d.height / 2
                    }
                },
                events: {
                    drag: function(a,
                        c) {
                        var b = this.mouseMoveToTranslation(a);
                        a = c.options.typeOptions.selectType;
                        var d = "y" === a ? 0 : b.x;
                        b = "x" === a ? 0 : b.y;
                        c.resize(d, b, this.index, a);
                        c.resizeX += d;
                        c.resizeY += b;
                        c.redraw(!1, !0)
                    }
                }
            }
        });
        return c.types.measure = h
    });
    r(e, "mixins/navigation.js", [], function() {
        return {
            initUpdate: function(f) {
                f.navigation || (f.navigation = {
                    updates: [],
                    update: function(f, e) {
                        this.updates.forEach(function(h) {
                            h.update.call(h.context, f, e)
                        })
                    }
                })
            },
            addUpdate: function(f, e) {
                e.navigation || this.initUpdate(e);
                e.navigation.updates.push({
                    update: f,
                    context: e
                })
            }
        }
    });
    r(e, "annotations/navigationBindings.js", [e["parts/Globals.js"], e["parts/Utilities.js"], e["mixins/navigation.js"]], function(f, e, r) {
        function h(a) {
            var b = a.prototype.defaultOptions.events && a.prototype.defaultOptions.events.click;
            f.merge(!0, a.prototype.defaultOptions.events, {
                click: function(a) {
                    var c = this,
                        d = c.chart.navigationBindings,
                        g = d.activeAnnotation;
                    b && b.click.call(c, a);
                    g !== c ? (d.deselectAnnotation(), d.activeAnnotation = c, c.setControlPointsVisibility(!0), n(d, "showPopup", {
                        annotation: c,
                        formType: "annotation-toolbar",
                        options: d.annotationToFields(c),
                        onSubmit: function(a) {
                            var b = {};
                            "remove" === a.actionType ? (d.activeAnnotation = !1, d.chart.removeAnnotation(c)) : (d.fieldsToOptions(a.fields, b), d.deselectAnnotation(), a = b.typeOptions, "measure" === c.options.type && (a.crosshairY.enabled = 0 !== a.crosshairY.strokeWidth, a.crosshairX.enabled = 0 !== a.crosshairX.strokeWidth), c.update(b))
                        }
                    })) : (d.deselectAnnotation(), n(d, "closePopup"));
                    a.activeAnnotation = !0
                }
            })
        }
        var c = e.attr,
            d = e.isArray,
            a = e.isNumber,
            b = e.isObject,
            g = e.objectEach,
            p = f.doc,
            u = f.win,
            k = f.addEvent,
            l = f.pick,
            v = f.merge;
        e = f.extend;
        var n = f.fireEvent;
        f.NavigationBindings = function(a, b) {
            this.chart = a;
            this.options = b;
            this.eventsToUnbind = [];
            this.container = p.getElementsByClassName(this.options.bindingsClassName)
        };
        f.NavigationBindings.annotationsEditable = {
            nestedOptions: {
                labelOptions: ["style", "format", "backgroundColor"],
                labels: ["style"],
                label: ["style"],
                style: ["fontSize", "color"],
                background: ["fill", "strokeWidth", "stroke"],
                innerBackground: ["fill", "strokeWidth", "stroke"],
                outerBackground: ["fill", "strokeWidth", "stroke"],
                shapeOptions: ["fill", "strokeWidth", "stroke"],
                shapes: ["fill", "strokeWidth", "stroke"],
                line: ["strokeWidth", "stroke"],
                backgroundColors: [!0],
                connector: ["fill", "strokeWidth", "stroke"],
                crosshairX: ["strokeWidth", "stroke"],
                crosshairY: ["strokeWidth", "stroke"]
            },
            circle: ["shapes"],
            verticalLine: [],
            label: ["labelOptions"],
            measure: ["background", "crosshairY", "crosshairX"],
            fibonacci: [],
            tunnel: ["background", "line", "height"],
            pitchfork: ["innerBackground", "outerBackground"],
            rect: ["shapes"],
            crookedLine: []
        };
        f.NavigationBindings.annotationsNonEditable = {
            rectangle: ["crosshairX", "crosshairY", "label"]
        };
        e(f.NavigationBindings.prototype, {
            initEvents: function() {
                var a = this,
                    b = a.chart,
                    c = a.container,
                    d = a.options;
                a.boundClassNames = {};
                g(d.bindings, function(b) {
                    a.boundClassNames[b.className] = b
                });
                [].forEach.call(c, function(b) {
                    a.eventsToUnbind.push(k(b, "mousemove", function(b) {
                        var d = a.getButtonEvents(c, b);
                        d && a.bindingsButtonClick(d.button, d.events, b)
                    }))
                });
                g(d.events || {}, function(b, c) {
                    f.isFunction(b) &&
                        a.eventsToUnbind.push(k(a, c, b))
                });
                a.eventsToUnbind.push(k(b.container, "click", function(c) {
                    !b.cancelClick && b.isInsidePlot(c.chartX - b.plotLeft, c.chartY - b.plotTop) && a.bindingsChartClick(this, c)
                }));
                a.eventsToUnbind.push(k(b.container, "mousemove", function(b) {
                    a.bindingsContainerMouseMove(this, b)
                }))
            },
            initUpdate: function() {
                var a = this;
                r.addUpdate(function(b) {
                    a.update(b)
                }, this.chart)
            },
            bindingsButtonClick: function(a, b, c) {
                var d = this.chart;
                this.selectedButtonElement && (n(this, "deselectButton", {
                        button: this.selectedButtonElement
                    }),
                    this.nextEvent && (this.currentUserDetails && "annotations" === this.currentUserDetails.coll && d.removeAnnotation(this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1));
                this.selectedButton = b;
                this.selectedButtonElement = a;
                n(this, "selectButton", {
                    button: a
                });
                b.init && b.init.call(this, a, c);
                (b.start || b.steps) && d.renderer.boxWrapper.addClass("highcharts-draw-mode")
            },
            bindingsChartClick: function(a, b) {
                a = this.selectedButton;
                var c = this.chart.renderer.boxWrapper,
                    d;
                if (d = this.activeAnnotation && !b.activeAnnotation &&
                    b.target.parentNode) {
                    a: {
                        d = b.target;
                        var g = u.Element.prototype,
                            f = g.matches || g.msMatchesSelector || g.webkitMatchesSelector,
                            e = null;
                        if (g.closest) e = g.closest.call(d, ".highcharts-popup");
                        else {
                            do {
                                if (f.call(d, ".highcharts-popup")) break a;
                                d = d.parentElement || d.parentNode
                            } while (null !== d && 1 === d.nodeType)
                        }
                        d = e
                    }
                    d = !d
                }
                d && (n(this, "closePopup"), this.deselectAnnotation());
                a && a.start && (this.nextEvent ? (this.nextEvent(b, this.currentUserDetails), this.steps && (this.stepIndex++, a.steps[this.stepIndex] ? this.mouseMoveEvent = this.nextEvent =
                    a.steps[this.stepIndex] : (n(this, "deselectButton", {
                        button: this.selectedButtonElement
                    }), c.removeClass("highcharts-draw-mode"), a.end && a.end.call(this, b, this.currentUserDetails), this.mouseMoveEvent = this.nextEvent = !1, this.selectedButton = null))) : (this.currentUserDetails = a.start.call(this, b), a.steps ? (this.stepIndex = 0, this.steps = !0, this.mouseMoveEvent = this.nextEvent = a.steps[this.stepIndex]) : (n(this, "deselectButton", {
                        button: this.selectedButtonElement
                    }), c.removeClass("highcharts-draw-mode"), this.steps = !1, this.selectedButton =
                    null, a.end && a.end.call(this, b, this.currentUserDetails))))
            },
            bindingsContainerMouseMove: function(a, b) {
                this.mouseMoveEvent && this.mouseMoveEvent(b, this.currentUserDetails)
            },
            fieldsToOptions: function(b, c) {
                g(b, function(b, d) {
                    var g = parseFloat(b),
                        f = d.split("."),
                        e = c,
                        k = f.length - 1;
                    !a(g) || b.match(/px/g) || d.match(/format/g) || (b = g);
                    "" !== b && "undefined" !== b && f.forEach(function(a, c) {
                        var d = l(f[c + 1], "");
                        k === c ? e[a] = b : (e[a] || (e[a] = d.match(/\d/g) ? [] : {}), e = e[a])
                    })
                });
                return c
            },
            deselectAnnotation: function() {
                this.activeAnnotation &&
                    (this.activeAnnotation.setControlPointsVisibility(!1), this.activeAnnotation = !1)
            },
            annotationToFields: function(a) {
                function c(e, k, l, t) {
                    if (l && -1 === v.indexOf(k) && (0 <= (l.indexOf && l.indexOf(k)) || l[k] || !0 === l))
                        if (d(e)) t[k] = [], e.forEach(function(a, d) {
                            b(a) ? (t[k][d] = {}, g(a, function(a, b) {
                                c(a, b, h[k], t[k][d])
                            })) : c(a, 0, h[k], t[k])
                        });
                        else if (b(e)) {
                        var n = {};
                        d(t) ? (t.push(n), n[k] = {}, n = n[k]) : t[k] = n;
                        g(e, function(a, b) {
                            c(a, b, 0 === k ? l : h[k], n)
                        })
                    } else "format" === k ? t[k] = [f.format(e, a.labels[0].points[0]).toString(), "text"] : d(t) ?
                        t.push([e, q(e)]) : t[k] = [e, q(e)]
                }
                var e = a.options,
                    k = f.NavigationBindings.annotationsEditable,
                    h = k.nestedOptions,
                    q = this.utils.getFieldType,
                    n = l(e.type, e.shapes && e.shapes[0] && e.shapes[0].type, e.labels && e.labels[0] && e.labels[0].itemType, "label"),
                    v = f.NavigationBindings.annotationsNonEditable[e.langKey] || [],
                    m = {
                        langKey: e.langKey,
                        type: n
                    };
                g(e, function(a, b) {
                    "typeOptions" === b ? (m[b] = {}, g(e[b], function(a, d) {
                        c(a, d, h, m[b], !0)
                    })) : c(a, b, k[n], m)
                });
                return m
            },
            getClickedClassNames: function(a, b) {
                var d = b.target;
                b = [];
                for (var e; d &&
                    ((e = c(d, "class")) && (b = b.concat(e.split(" ").map(function(a) {
                        return [a, d]
                    }))), d = d.parentNode, d !== a););
                return b
            },
            getButtonEvents: function(a, b) {
                var c = this,
                    d;
                this.getClickedClassNames(a, b).forEach(function(a) {
                    c.boundClassNames[a[0]] && !d && (d = {
                        events: c.boundClassNames[a[0]],
                        button: a[1]
                    })
                });
                return d
            },
            update: function(a) {
                this.options = v(!0, this.options, a);
                this.removeEvents();
                this.initEvents()
            },
            removeEvents: function() {
                this.eventsToUnbind.forEach(function(a) {
                    a()
                })
            },
            destroy: function() {
                this.removeEvents()
            },
            utils: {
                updateRectSize: function(a,
                    b) {
                    var c = b.chart,
                        d = b.options.typeOptions,
                        e = c.pointer.getCoordinates(a);
                    a = e.xAxis[0].value - d.point.x;
                    d = d.point.y - e.yAxis[0].value;
                    b.update({
                        typeOptions: {
                            background: {
                                width: c.inverted ? d : a,
                                height: c.inverted ? a : d
                            }
                        }
                    })
                },
                getFieldType: function(a) {
                    return {
                        string: "text",
                        number: "number",
                        "boolean": "checkbox"
                    }[typeof a]
                }
            }
        });
        f.Chart.prototype.initNavigationBindings = function() {
            var a = this.options;
            a && a.navigation && a.navigation.bindings && (this.navigationBindings = new f.NavigationBindings(this, a.navigation), this.navigationBindings.initEvents(),
                this.navigationBindings.initUpdate())
        };
        k(f.Chart, "load", function() {
            
                
            
            this.initNavigationBindings()
        });
        k(f.Chart, "destroy", function() {
            this.navigationBindings && this.navigationBindings.destroy()
        });
        k(f.NavigationBindings, "deselectButton", function() {
            this.selectedButtonElement = null
        });
        k(f.Annotation, "remove", function() {
            this.chart.navigationBindings && this.chart.navigationBindings.deselectAnnotation()
        });
        f.Annotation && (h(f.Annotation), g(f.Annotation.types, function(a) {
            h(a)
        }));
        f.setOptions({
            lang: {
                navigation: {
                    popup: {
                        simpleShapes: "Simple shapes",
                        lines: "Lines",
                        circle: "Circle",
                        rectangle: "Rectangle",
                        label: "Label",
                        shapeOptions: "Shape options",
                        typeOptions: "Details",
                        fill: "Fill",
                        format: "Text",
                        strokeWidth: "Line width",
                        stroke: "Line color",
                        title: "Title",
                        name: "Name",
                        labelOptions: "Label options",
                        labels: "Labels",
                        backgroundColor: "Background color",
                        backgroundColors: "Background colors",
                        borderColor: "Border color",
                        borderRadius: "Border radius",
                        borderWidth: "Border width",
                        style: "Style",
                        padding: "Padding",
                        fontSize: "Font size",
                        color: "Color",
                        height: "Height",
                        shapes: "Shape options"
                    }
                }
            },
            navigation: {
                bindingsClassName: "highcharts-bindings-container",
                bindings: {
                    circleAnnotation: {
                        className: "highcharts-circle-annotation",
                        start: function(a) {
                            a = this.chart.pointer.getCoordinates(a);
                            var b = this.chart.options.navigation;
                            return this.chart.addAnnotation(v({
                                langKey: "circle",
                                shapes: [{
                                    type: "circle",
                                    point: {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: a.xAxis[0].value,
                                        y: a.yAxis[0].value
                                    },
                                    r: 5,
                                    controlPoints: [{
                                        positioner: function(a) {
                                            var b = f.Annotation.MockPoint.pointToPixels(a.points[0]);
                                            a = a.options.r;
                                            return {
                                                x: b.x + a * Math.cos(Math.PI /
                                                    4) - this.graphic.width / 2,
                                                y: b.y + a * Math.sin(Math.PI / 4) - this.graphic.height / 2
                                            }
                                        },
                                        events: {
                                            drag: function(a, b) {
                                                var c = b.annotation;
                                                a = this.mouseMoveToTranslation(a);
                                                b.setRadius(Math.max(b.options.r + a.y / Math.sin(Math.PI / 4), 5));
                                                c.options.shapes[0] = c.userOptions.shapes[0] = b.options;
                                                b.redraw(!1)
                                            }
                                        }
                                    }]
                                }]
                            }, b.annotationsOptions, b.bindings.circleAnnotation.annotationsOptions))
                        },
                        steps: [function(a, b) {
                            var c = b.options.shapes[0].point,
                                d = this.chart.xAxis[0].toPixels(c.x);
                            c = this.chart.yAxis[0].toPixels(c.y);
                            var e = this.chart.inverted;
                            b.update({
                                shapes: [{
                                    r: Math.max(Math.sqrt(Math.pow(e ? c - a.chartX : d - a.chartX, 2) + Math.pow(e ? d - a.chartY : c - a.chartY, 2)), 5)
                                }]
                            })
                        }]
                    },
                    rectangleAnnotation: {
                        className: "highcharts-rectangle-annotation",
                        start: function(a) {
                            var b = this.chart.pointer.getCoordinates(a);
                            a = this.chart.options.navigation;
                            var c = b.xAxis[0].value;
                            b = b.yAxis[0].value;
                            return this.chart.addAnnotation(v({
                                langKey: "rectangle",
                                shapes: [{
                                    type: "path",
                                    points: [{
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: c,
                                        y: b
                                    }, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: c,
                                        y: b
                                    }, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: c,
                                        y: b
                                    }, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: c,
                                        y: b
                                    }]
                                }],
                                controlPoints: [{
                                    positioner: function(a) {
                                        a = f.Annotation.MockPoint.pointToPixels(a.shapes[0].points[2]);
                                        return {
                                            x: a.x - 4,
                                            y: a.y - 4
                                        }
                                    },
                                    events: {
                                        drag: function(a, b) {
                                            var c = this.chart.pointer.getCoordinates(a);
                                            a = c.xAxis[0].value;
                                            c = c.yAxis[0].value;
                                            var d = b.options.shapes[0].points;
                                            d[1].x = a;
                                            d[2].x = a;
                                            d[2].y = c;
                                            d[3].y = c;
                                            b.options.shapes[0].points = d;
                                            b.redraw(!1)
                                        }
                                    }
                                }]
                            }, a.annotationsOptions, a.bindings.rectangleAnnotation.annotationsOptions))
                        },
                        steps: [function(a, b) {
                            var c = b.options.shapes[0].points,
                                d = this.chart.pointer.getCoordinates(a);
                            a = d.xAxis[0].value;
                            d = d.yAxis[0].value;
                            c[1].x = a;
                            c[2].x = a;
                            c[2].y = d;
                            c[3].y = d;
                            b.update({
                                shapes: [{
                                    points: c
                                }]
                            })
                        }]
                    },
                    labelAnnotation: {
                        className: "highcharts-label-annotation",
                        start: function(a) {
                            a = this.chart.pointer.getCoordinates(a);
                            var b = this.chart.options.navigation;
                            return this.chart.addAnnotation(v({
                                langKey: "label",
                                labelOptions: {
                                    format: "{y:.2f}"
                                },
                                labels: [{
                                    point: {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: a.xAxis[0].value,
                                        y: a.yAxis[0].value
                                    },
                                    overflow: "none",
                                    crop: !0,
                                    controlPoints: [{
                                        symbol: "triangle-down",
                                        positioner: function(a) {
                                            if (!a.graphic.placed) return {
                                                x: 0,
                                                y: -9E7
                                            };
                                            a = f.Annotation.MockPoint.pointToPixels(a.points[0]);
                                            return {
                                                x: a.x - this.graphic.width / 2,
                                                y: a.y - this.graphic.height / 2
                                            }
                                        },
                                        events: {
                                            drag: function(a, b) {
                                                a = this.mouseMoveToTranslation(a);
                                                b.translatePoint(a.x, a.y);
                                                b.annotation.labels[0].options = b.options;
                                                b.redraw(!1)
                                            }
                                        }
                                    }, {
                                        symbol: "square",
                                        positioner: function(a) {
                                            return a.graphic.placed ? {
                                                x: a.graphic.alignAttr.x - this.graphic.width / 2,
                                                y: a.graphic.alignAttr.y - this.graphic.height / 2
                                            } : {
                                                x: 0,
                                                y: -9E7
                                            }
                                        },
                                        events: {
                                            drag: function(a, b) {
                                                a = this.mouseMoveToTranslation(a);
                                                b.translate(a.x,
                                                    a.y);
                                                b.annotation.labels[0].options = b.options;
                                                b.redraw(!1)
                                            }
                                        }
                                    }]
                                }]
                            }, b.annotationsOptions, b.bindings.labelAnnotation.annotationsOptions))
                        }
                    }
                },
                events: {},
                annotationsOptions: {}
            }
        })
    });
    r(e, "annotations/popup.js", [e["parts/Globals.js"], e["parts/Utilities.js"]], function(e, h) {
        var f = h.defined,
            m = h.isArray,
            c = h.isObject,
            d = h.isString,
            a = h.objectEach,
            b = e.addEvent,
            g = e.createElement,
            p = e.pick;
        h = e.wrap;
        var r = /\d/g;
        h(e.Pointer.prototype, "onContainerMouseDown", function(a, b) {
            var c = b.target && b.target.className;
            d(c) && 0 <= c.indexOf("highcharts-popup-field") ||
                a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        e.Popup = function(a, b) {
            this.init(a, b)
        };
        e.Popup.prototype = {
            init: function(a, b) {
                this.container = g("div", {
                    className: "highcharts-popup"
                }, null, a);
                this.lang = this.getLangpack();
                this.iconsURL = b;
                this.addCloseBtn()
            },
            addCloseBtn: function() {
                var a = this;
                var c = g("div", {
                    className: "highcharts-popup-close"
                }, null, this.container);
                c.style["background-image"] = "url(" + this.iconsURL + "close.svg)";
                ["click", "touchstart"].forEach(function(d) {
                    b(c, d, function() {
                        a.closePopup()
                    })
                })
            },
            addColsContainer: function(a) {
                var b = g("div", {
                    className: "highcharts-popup-lhs-col"
                }, null, a);
                a = g("div", {
                    className: "highcharts-popup-rhs-col"
                }, null, a);
                g("div", {
                    className: "highcharts-popup-rhs-col-wrapper"
                }, null, a);
                return {
                    lhsCol: b,
                    rhsCol: a
                }
            },
            addInput: function(a, b, c, d) {
                var e = a.split(".");
                e = e[e.length - 1];
                var f = this.lang;
                b = "highcharts-" + b + "-" + e;
                b.match(r) || g("label", {
                    innerHTML: f[e] || e,
                    htmlFor: b
                }, null, c);
                g("input", {
                    name: b,
                    value: d[0],
                    type: d[1],
                    className: "highcharts-popup-field"
                }, null, c).setAttribute("highcharts-data-name",
                    a)
            },
            addButton: function(a, c, d, e, f) {
                var k = this,
                    l = this.closePopup,
                    h = this.getFields;
                var n = g("button", {
                    innerHTML: c
                }, null, a);
                ["click", "touchstart"].forEach(function(a) {
                    b(n, a, function() {
                        l.call(k);
                        return e(h(f, d))
                    })
                });
                return n
            },
            getFields: function(a, b) {
                var c = a.querySelectorAll("input"),
                    d = a.querySelectorAll("#highcharts-select-series > option:checked")[0];
                a = a.querySelectorAll("#highcharts-select-volume > option:checked")[0];
                var e, g;
                var f = {
                    actionType: b,
                    linkedTo: d && d.getAttribute("value"),
                    fields: {}
                };
                [].forEach.call(c,
                    function(a) {
                        g = a.getAttribute("highcharts-data-name");
                        (e = a.getAttribute("highcharts-data-series-id")) ? f.seriesId = a.value: g ? f.fields[g] = a.value : f.type = a.value
                    });
                a && (f.fields["params.volumeSeriesID"] = a.getAttribute("value"));
                return f
            },
            showPopup: function() {
                var a = this.container,
                    b = a.querySelectorAll(".highcharts-popup-close")[0];
                a.innerHTML = "";
                0 <= a.className.indexOf("highcharts-annotation-toolbar") && (a.classList.remove("highcharts-annotation-toolbar"), a.removeAttribute("style"));
                a.appendChild(b);
                a.style.display =
                    "block"
            },
            closePopup: function() {
                this.popup.container.style.display = "none"
            },
            showForm: function(a, b, c, d) {
                this.popup = b.navigationBindings.popup;
                this.showPopup();
                "indicators" === a && this.indicators.addForm.call(this, b, c, d);
                "annotation-toolbar" === a && this.annotations.addToolbar.call(this, b, c, d);
                "annotation-edit" === a && this.annotations.addForm.call(this, b, c, d);
                "flag" === a && this.annotations.addForm.call(this, b, c, d, !0)
            },
            getLangpack: function() {
                return e.getOptions().lang.navigation.popup
            },
            annotations: {
                addToolbar: function(a,
                    b, c) {
                    var d = this,
                        e = this.lang,
                        f = this.popup.container,
                        k = this.showForm; - 1 === f.className.indexOf("highcharts-annotation-toolbar") && (f.className += " highcharts-annotation-toolbar");
                    f.style.top = a.plotTop + 10 + "px";
                    g("span", {
                        innerHTML: p(e[b.langKey] || b.langKey, b.shapes && b.shapes[0].type)
                    }, null, f);
                    var l = this.addButton(f, e.removeButton || "remove", "remove", c, f);
                    l.className += " highcharts-annotation-remove-button";
                    l.style["background-image"] = "url(" + this.iconsURL + "destroy.svg)";
                    l = this.addButton(f, e.editButton || "edit",
                        "edit",
                        function() {
                            k.call(d, "annotation-edit", a, b, c)
                        }, f);
                    l.className += " highcharts-annotation-edit-button";
                    l.style["background-image"] = "url(" + this.iconsURL + "edit.svg)"
                },
                addForm: function(a, b, c, d) {
                    var e = this.popup.container,
                        f = this.lang;
                    g("h2", {
                        innerHTML: f[b.langKey] || b.langKey,
                        className: "highcharts-popup-main-title"
                    }, null, e);
                    var k = g("div", {
                        className: "highcharts-popup-lhs-col highcharts-popup-lhs-full"
                    }, null, e);
                    var l = g("div", {
                        className: "highcharts-popup-bottom-row"
                    }, null, e);
                    this.annotations.addFormFields.call(this,
                        k, a, "", b, [], !0);
                    this.addButton(l, d ? f.addButton || "add" : f.saveButton || "save", d ? "add" : "save", c, e)
                },
                addFormFields: function(b, d, e, f, h, t) {
                    var k = this,
                        l = this.annotations.addFormFields,
                        n = this.addInput,
                        q = this.lang,
                        v, p;
                    a(f, function(a, f) {
                        v = "" !== e ? e + "." + f : f;
                        c(a) && (!m(a) || m(a) && c(a[0]) ? (p = q[f] || f, p.match(r) || h.push([!0, p, b]), l.call(k, b, d, v, a, h, !1)) : h.push([k, v, "annotation", b, a]))
                    });
                    t && (h = h.sort(function(a) {
                        return a[1].match(/format/g) ? -1 : 1
                    }), h.forEach(function(a) {
                        !0 === a[0] ? g("span", {
                            className: "highcharts-annotation-title",
                            innerHTML: a[1]
                        }, null, a[2]) : n.apply(a[0], a.splice(1))
                    }))
                }
            },
            indicators: {
                addForm: function(a, b, c) {
                    var d = this.indicators,
                        e = this.lang;
                    this.tabs.init.call(this, a);
                    b = this.popup.container.querySelectorAll(".highcharts-tab-item-content");
                    this.addColsContainer(b[0]);
                    d.addIndicatorList.call(this, a, b[0], "add");
                    var f = b[0].querySelectorAll(".highcharts-popup-rhs-col")[0];
                    this.addButton(f, e.addButton || "add", "add", c, f);
                    this.addColsContainer(b[1]);
                    d.addIndicatorList.call(this, a, b[1], "edit");
                    f = b[1].querySelectorAll(".highcharts-popup-rhs-col")[0];
                    this.addButton(f, e.saveButton || "save", "edit", c, f);
                    this.addButton(f, e.removeButton || "remove", "remove", c, f)
                },
                addIndicatorList: function(c, d, e) {
                    var f = this,
                        k = d.querySelectorAll(".highcharts-popup-lhs-col")[0];
                    d = d.querySelectorAll(".highcharts-popup-rhs-col")[0];
                    var h = "edit" === e,
                        l = h ? c.series : c.options.plotOptions,
                        m = this.indicators.addFormFields,
                        p;
                    var v = g("ul", {
                        className: "highcharts-indicator-list"
                    }, null, k);
                    var r = d.querySelectorAll(".highcharts-popup-rhs-col-wrapper")[0];
                    a(l, function(a, d) {
                        var e = a.options;
                        if (a.params || e && e.params) {
                            var k = f.indicators.getNameType(a, d),
                                n = k.type;
                            p = g("li", {
                                className: "highcharts-indicator-list",
                                innerHTML: k.name
                            }, null, v);
                            ["click", "touchstart"].forEach(function(d) {
                                b(p, d, function() {
                                    m.call(f, c, h ? a : l[n], k.type, r);
                                    h && a.options && g("input", {
                                        type: "hidden",
                                        name: "highcharts-id-" + n,
                                        value: a.options.id
                                    }, null, r).setAttribute("highcharts-data-series-id", a.options.id)
                                })
                            })
                        }
                    });
                    0 < v.childNodes.length && v.childNodes[0].click()
                },
                getNameType: function(a, b) {
                    var c = a.options,
                        d = e.seriesTypes;
                    d = d[b] &&
                        d[b].prototype.nameBase || b.toUpperCase();
                    c && c.type && (b = a.options.type, d = a.name);
                    return {
                        name: d,
                        type: b
                    }
                },
                listAllSeries: function(a, b, c, d, e) {
                    a = "highcharts-" + b + "-type-" + a;
                    var h;
                    g("label", {
                        innerHTML: this.lang[b] || b,
                        htmlFor: a
                    }, null, d);
                    var k = g("select", {
                        name: a,
                        className: "highcharts-popup-field"
                    }, null, d);
                    k.setAttribute("id", "highcharts-select-" + b);
                    c.series.forEach(function(a) {
                        h = a.options;
                        !h.params && h.id && "highcharts-navigator-series" !== h.id && g("option", {
                            innerHTML: h.name || h.id,
                            value: h.id
                        }, null, k)
                    });
                    f(e) && (k.value =
                        e)
                },
                addFormFields: function(a, b, c, d) {
                    var e = b.params || b.options.params,
                        f = this.indicators.getNameType;
                    d.innerHTML = "";
                    g("h3", {
                        className: "highcharts-indicator-title",
                        innerHTML: f(b, c).name
                    }, null, d);
                    g("input", {
                        type: "hidden",
                        name: "highcharts-type-" + c,
                        value: c
                    }, null, d);
                    this.indicators.listAllSeries.call(this, c, "series", a, d, b.linkedParent && e.volumeSeriesID);
                    e.volumeSeriesID && this.indicators.listAllSeries.call(this, c, "volume", a, d, b.linkedParent && b.linkedParent.options.id);
                    this.indicators.addParamInputs.call(this,
                        a, "params", e, c, d)
                },
                addParamInputs: function(b, d, e, f, g) {
                    var h = this,
                        k = this.indicators.addParamInputs,
                        l = this.addInput,
                        m;
                    a(e, function(a, e) {
                        m = d + "." + e;
                        c(a) ? k.call(h, b, m, a, f, g) : "params.volumeSeriesID" !== m && l.call(h, m, f, g, [a, "text"])
                    })
                },
                getAmount: function() {
                    var b = 0;
                    a(this.series, function(a) {
                        var c = a.options;
                        (a.params || c && c.params) && b++
                    });
                    return b
                }
            },
            tabs: {
                init: function(a) {
                    var b = this.tabs;
                    a = this.indicators.getAmount.call(a);
                    var c = b.addMenuItem.call(this, "add");
                    b.addMenuItem.call(this, "edit", a);
                    b.addContentItem.call(this,
                        "add");
                    b.addContentItem.call(this, "edit");
                    b.switchTabs.call(this, a);
                    b.selectTab.call(this, c, 0)
                },
                addMenuItem: function(a, b) {
                    var c = this.popup.container,
                        d = "highcharts-tab-item",
                        e = this.lang;
                    0 === b && (d += " highcharts-tab-disabled");
                    b = g("span", {
                        innerHTML: e[a + "Button"] || a,
                        className: d
                    }, null, c);
                    b.setAttribute("highcharts-data-tab-type", a);
                    return b
                },
                addContentItem: function() {
                    return g("div", {
                        className: "highcharts-tab-item-content"
                    }, null, this.popup.container)
                },
                switchTabs: function(a) {
                    var c = this,
                        d;
                    this.popup.container.querySelectorAll(".highcharts-tab-item").forEach(function(e,
                        f) {
                        d = e.getAttribute("highcharts-data-tab-type");
                        "edit" === d && 0 === a || ["click", "touchstart"].forEach(function(a) {
                            b(e, a, function() {
                                c.tabs.deselectAll.call(c);
                                c.tabs.selectTab.call(c, this, f)
                            })
                        })
                    })
                },
                selectTab: function(a, b) {
                    var c = this.popup.container.querySelectorAll(".highcharts-tab-item-content");
                    a.className += " highcharts-tab-item-active";
                    c[b].className += " highcharts-tab-item-show"
                },
                deselectAll: function() {
                    var a = this.popup.container,
                        b = a.querySelectorAll(".highcharts-tab-item");
                    a = a.querySelectorAll(".highcharts-tab-item-content");
                    var c;
                    for (c = 0; c < b.length; c++) b[c].classList.remove("highcharts-tab-item-active"), a[c].classList.remove("highcharts-tab-item-show")
                }
            }
        };
        b(e.NavigationBindings, "showPopup", function(a) {
            this.popup || (this.popup = new e.Popup(this.chart.container, this.chart.options.navigation.iconsURL || this.chart.options.stockTools && this.chart.options.stockTools.gui.iconsURL || "https://code.highcharts.com/7.2.0/gfx/stock-icons/"));
            this.popup.showForm(a.formType, this.chart, a.options, a.onSubmit)
        });
        b(e.NavigationBindings, "closePopup",
            function() {
                this.popup && this.popup.closePopup()
            })
    });
    r(e, "masters/modules/annotations-advanced.src.js", [], function() {})
});
//# sourceMappingURL=annotations-advanced.js.map