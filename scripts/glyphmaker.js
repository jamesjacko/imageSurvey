var seed, colorSeed, settings;

/**
 * As there is no way to seed a random within the JS Math clas it is
 * necessary to provide a seedable random function.
 */
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function getJSONObj() {
    settings = JSON.parse(document.getElementById('JSON').value);
}

function getJSONObj(string) {
    settings = string;
}

function loadDataPoints(obj) {
    settings = obj
    seed = obj.name.hashCode();
    colorSeed = seed;
}

function draw(ctx, glyph) {
    ctx.beginPath();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var size = ctx.canvas.width - 10;
    var offsetx = 10;
    var offsety = 10;
    //ctx.rect(offset, offset, size, size);
    //ctx.stroke();
    var coords = initCoords(size, settings.values.length);
    var pivot = {
        x: (size / 2),
        y: (size / 2)
    };
    var angle = degToRad(random() * 180);
    var midPoints = [];
    coords.forEach(function(elem, e) {
        coords[e] = rotatePoint(pivot, elem, angle);

        coords[e].corner = closestCorner(coords[e], size);;
        if (e !== 0) {
            var midPoint = {
                x: (coords[e - 1].x + coords[e].x) / 2,
                y: (coords[e - 1].y + coords[e].y) / 2,
                angle: Math.atan2(coords[e].y - coords[e - 1].y, coords[e].x - coords[e - 1].x)
            }
            midPoints.push(midPoint);
        }
        // first coord normal assigned seeded by object name
        coords[0].normal = random();
        for (var i = 0; i < midPoints.length; i++) {
            var norm = (settings.values[i].value - settings.values[i].min) / (settings.values[i].max - settings.values[i].min);
            var featureHeight = 20;
            var normValue = featureHeight * norm;
            var point = {
                x: Math.sin(midPoints[i].angle) * normValue + midPoints[i].x,
                y: -Math.cos(midPoints[i].angle) * normValue + midPoints[i].y,
                altx: Math.sin(midPoints[i].angle) * -normValue + midPoints[i].x,
                alty: -Math.cos(midPoints[i].angle) * -normValue + midPoints[i].y,
            }
            midPoints[i].peak = point;
            // assign normals to remaining points.
            coords[i + 1].normal = norm;
        }
    });

    for (var i = 0; i < midPoints.length; i++) {
        var norm = (settings.values[i].value - settings.values[i].min) / (settings.values[i].max - settings.values[i].min);
        var featureHeight = 20;
        var normValue = featureHeight * norm;
        var point = {
            x: Math.sin(midPoints[i].angle) * normValue + midPoints[i].x,
            y: -Math.cos(midPoints[i].angle) * normValue + midPoints[i].y,
            altx: Math.sin(midPoints[i].angle) * -normValue + midPoints[i].x,
            alty: -Math.cos(midPoints[i].angle) * -normValue + midPoints[i].y,
        }
        midPoints[i].peak = point;
        // assign normals to remaining points.
        coords[i + 1].normal = norm;
    }
    var offset = 0;
    var opacity = 1;

    var colors = [];
    var canvasWidth = ctx.canvas.width;
    seed = colorSeed;
    for (var i = 0; i <= settings.values.length; i++) {
        colors.push(getRandomColor(opacity));
    };
    var glyphSize = size + 20;

    switch (glyph) {
        case 0:
            drawLine(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth), coords);
            break;
        case 1:
            drawPoints(ctx, coords, {
                x: (offsetx + glyphSize * offset) % canvasWidth,
                y: Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize
            });
            break;
        case 2:
            drawMidPointLines(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth), coords, midPoints);
            break;
        case 3:
            drawLine(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth), coords);
            drawPoints(ctx, coords, {
                x: (offsetx + glyphSize * offset) % canvasWidth,
                y: Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize
            });
            break;
        case 4:
            drawLine(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth), coords);
            drawPoints(ctx, coords, {
                x: (offsetx + glyphSize * offset) % canvasWidth,
                y: Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize
            });
            drawMidPointLines(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth), coords, midPoints);
            break;
        case 5:
            drawLine(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize, coords);
            drawPoints(ctx, coords, {
                x: (offsetx + glyphSize * offset) % canvasWidth,
                y: Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize
            });
            drawMidPointLines(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, true);
            break;
        case 6:
            drawTriangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints);
            break;
        case 7:
            drawTriangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, {
                colors: colors
            });
            break;
        case 8:
            drawTriangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, {
                alternate: true
            });
            break;
        case 9:
            drawTriangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, {
                alternate: true,
                colors: colors
            });
            break;
        case 10:
            drawCurves(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints);
            break;
        case 11:
            drawCurves(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, {
                colors: colors
            });


            break;
        case 12:
            drawCurves(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, {
                alternate: true
            });


            break;
        case 13:
            drawCurves(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, midPoints, {
                alternate: true,
                colors: colors
            });
            break;
        case 14:
            drawRectangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize, coords, size, colors);
            drawPoints(ctx, coords, {
                x: (offsetx + glyphSize * offset) % canvasWidth,
                y: Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize
            });
            break;
        case 15:
            drawRectangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                intersections: 1
            });
            break;
        case 16:
            drawRectangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                intersections: 2
            });
            break;
        case 17:
            drawRectangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: true
            });
            drawPoints(ctx, coords, {
                x: (offsetx + glyphSize * offset) % canvasWidth,
                y: Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize
            });
            break;
        case 18:
            drawRectangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                intersections: 1,
                relative: true
            });
            break;
        case 19:
            drawRectangles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                intersections: 2,
                relative: true
            });
            break;
        case 20:
            drawCircles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: true
            });
            break;
        case 21:
            drawCircles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                intersections: 1,
                relative: true
            });
            break;
        case 22:
            drawCircles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                intersections: 2,
                relative: true
            });
            break;
        case 23:
            metaBalls(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: true
            });
            break;
        case 24:
            metaBalls(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors);
            break;
        case 25:
            drawCircles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: true
            });
            metaBalls(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: true
            });
            break;
        case 26:
            drawCircles(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: false
            });
            metaBalls(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: false
            });
            break;
        case 27:
            metaBalls(ctx, (offsetx + glyphSize * offset) % canvasWidth, Math.floor((offsety + glyphSize * offset++) / canvasWidth) * glyphSize, coords, size, colors, {
                relative: true,
                pairs: true
            });
            break;
    }
}

function drawLine(ctx, offsetx, offsety, coords) {
    coords.forEach(function(elem, e) {
        var x = offsetx + elem.x;
        var y = offsety + elem.y;
        if (e === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (e === coords.length - 1) {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.lineTo(x, y);
        }
    });
}

function drawMidPointLines(ctx, offsetx, offsety, coords, midPoints, alternate) {
    for (var i = 0; i < midPoints.length; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetx + midPoints[i].x, offsety + midPoints[i].y);
        if (typeof alternate !== "undefined" && i % 2 === 0)
            ctx.lineTo(offsetx + midPoints[i].peak.altx, offsety + midPoints[i].peak.alty);
        else
            ctx.lineTo(offsetx + midPoints[i].peak.x, offsety + midPoints[i].peak.y);
        ctx.stroke();
    }
}

function drawTriangles(ctx, offsetx, offsety, coords, midPoints, options) {
    ctx.save();
    coords.forEach(function(elem, e) {
        if (e !== coords.length - 1) {
            ctx.beginPath();
            ctx.moveTo(offsetx + coords[e].x, offsety + coords[e].y);
            if (typeof options !== "undefined") {
                if (typeof options.colors !== "undefined") {
                    ctx.fillStyle = options.colors[e]
                }
                if (e % 2 !== 0 && options.alternate === true)
                    ctx.lineTo(offsetx + midPoints[e].peak.altx, offsety + midPoints[e].peak.alty);
                else
                    ctx.lineTo(offsetx + midPoints[e].peak.x, offsety + midPoints[e].peak.y);
            } else
                ctx.lineTo(offsetx + midPoints[e].peak.x, offsety + midPoints[e].peak.y);
            ctx.lineTo(offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
            ctx.fill();
        }
    });
    ctx.restore();
}


function drawCurves(ctx, offsetx, offsety, coords, midPoints, options) {
    ctx.save();
    coords.forEach(function(elem, e) {
        if (e !== coords.length - 1) {
            ctx.beginPath();
            ctx.moveTo(offsetx + coords[e].x, offsety + coords[e].y);
            if (typeof options !== "undefined") {
                if (typeof options.colors !== "undefined")
                    ctx.fillStyle = options.colors[e];
                if (e % 2 !== 0 && options.alternate === true)
                    ctx.quadraticCurveTo(offsetx + midPoints[e].peak.altx,
                        offsety + midPoints[e].peak.alty,
                        offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
                else
                    ctx.quadraticCurveTo(offsetx + midPoints[e].peak.x,
                        offsety + midPoints[e].peak.y,
                        offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
            } else {
                ctx.quadraticCurveTo(offsetx + midPoints[e].peak.x,
                    offsety + midPoints[e].peak.y,
                    offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
            }
            ctx.fill();
        }
    });
    ctx.restore();
}
/**
 *  Returns normalized coordinates for initial line
 */

function initCoords(size, numCoords) {
    var range = size * 0.9;
    var off = (size * 0.1) / 2;
    var points = [{
        x: Math.round(0.1 * size),
        y: Math.round((random() * range) + off)
    }];
    var multiplier = 1 / (numCoords);
    for (var i = 1; i < numCoords; i++) {
        points.push({
            x: Math.round((((multiplier * i) * 0.8) + 0.1) * size),
            y: Math.round((random() * range) + off)
        })
    }

    points.push({
        x: Math.round(0.9 * size),
        y: Math.round( /*(random() * range) + off*/ 50)
    });

    return points;
}
/**
 * Rotate point around a pivot point by a give angle
 */
function rotatePoint(pivot, point, angle) {
    var rotatedX = Math.cos(angle) * (point.x - pivot.x) - Math.sin(angle) * (point.y - pivot.y) + pivot.x;
    var rotatedY = Math.sin(angle) * (point.x - pivot.x) + Math.cos(angle) * (point.y - pivot.y) + pivot.y;
    return {
        x: (rotatedX < 0) ? 1 : Math.round(rotatedX),
        y: (rotatedY < 0) ? 1 : Math.round(rotatedY)
    };
}

function degToRad(angle) {
    return angle * (Math.PI / 180);
}


function drawPoints(ctx, coords, offset) {
    coords.forEach(function(elem) {
        ctx.beginPath();
        ctx.arc(offset.x + elem.x, offset.y + elem.y, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
    });
}

function closestCorner(coord, size) {
    return {
        x: Math.floor(coord.x / (size / 2)), // divide by 2 to center coords
        y: Math.floor(coord.y / (size / 2))
    }
}
var once = 0;

function drawRectangle(ctx, centre, offset, size, color, options) {
    // plus 1 to settings to account for name
    // if (once++ < settings.values.length + 1) {
    //     ctx.fillStyle = color;
    //     ctx.font = "bold 9px Arial";
    //     ctx.fillText("Option" + once, 40 * once, ctx.canvas.height - 30);
    // }
    var point = closestCorner(centre, size);
    if (options && options.relative) {
        var rectPoint = {
            x: (point.x === 0) ? 0 : size - ((size - centre.x) * 2),
            y: (point.y === 0) ? 0 : size - ((size - centre.y) * 2),
            w: (point.x === 0) ? centre.x * 2 * centre.normal : (size - centre.x) * 2 * centre.normal,
            h: (point.y === 0) ? centre.y * 2 * centre.normal : (size - centre.y) * 2 * centre.normal,
        };
    } else {
        var rectPoint = {
            x: (point.x === 0) ? 0 : size - ((size - centre.x) * 2),
            y: (point.y === 0) ? 0 : size - ((size - centre.y) * 2),
            w: (point.x === 0) ? centre.x * 2 : (size - centre.x) * 2,
            h: (point.y === 0) ? centre.y * 2 : (size - centre.y) * 2,
        };
    }
    ctx.beginPath();
    ctx.rect(rectPoint.x + offset.x, rectPoint.y + offset.y,
        rectPoint.w, rectPoint.h);
    ctx.fillStyle = color;
    ctx.fill();
    return rectPoint;
}

function getRandomColor(opacity) {
    return "rgba(" + Math.floor(random() * 255) +
        "," + Math.floor(random() * 255) +
        "," + Math.floor(random() * 255) +
        "," + opacity + ")";
}

function drawCircle(ctx, centre, offset, size, color, options) {
    // plus 1 to settings to account for name
    // if (once++ < settings.values.length + 1) {
    //     ctx.fillStyle = color;
    //     ctx.font = "bold 9px Arial";
    //     ctx.fillText("Option" + once, 40 * once, ctx.canvas.height - 30);
    // }
    var point = closestCorner(centre, size);

    var width = Math.min(Math.abs(point.x * size - centre.x), Math.abs(point.y * size - centre.y));

    var sizeNorm = (options && options.relative) ? width * centre.normal : width;
    ctx.beginPath();
    ctx.arc(offset.x + centre.x, offset.y + centre.y, sizeNorm, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    return {
        centre,
        size: sizeNorm
    };
}

function drawRectangles(ctx, offsetx, offsety, coords, size, colors, options) {
    var count = 0;
    ctx.save()
    ctx.globalCompositeOperation = "screen";
    var rectangles = [];
    coords.forEach(function(elem, e) {
        //if(count++ === 0)
        if (options && options.relative)
            rectangles.push(drawRectangle(ctx, elem, {
                x: offsetx,
                y: offsety
            }, size, colors[e], {
                relative: true
            }));
        else
            rectangles.push(drawRectangle(ctx, elem, {
                x: offsetx,
                y: offsety
            }, size, colors[e]));
    });

    ctx.globalCompositeOperation = "source-over";
    if (options) {
        if (options.intersections === 1) {
            removeIntersections(ctx, rectangles, {
                x: offsetx,
                y: offsety
            }, size);
        } else if (options.intersections === 2) {
            keepIntersections(ctx, rectangles, {
                x: offsetx,
                y: offsety
            }, size);
        }
    }
    ctx.restore();
}

function drawCircles(ctx, offsetx, offsety, coords, size, colors, options) {

    // console.log(typeof coords);
    var count = 0;
    ctx.save()
    ctx.globalCompositeOperation = "screen";
    var circles = [];
    coords.forEach(function(elem, e) {
        //if(count++ === 0)
        if (options && options.relative)
            circles.push(drawCircle(ctx, elem, {
                x: offsetx,
                y: offsety
            }, size, colors[e], {
                relative: true
            }));
        else
            circles.push(drawCircle(ctx, elem, {
                x: offsetx,
                y: offsety
            }, size, colors[e]));
    });

    ctx.globalCompositeOperation = "source-over";
    if (options) {
        if (options.intersections) {
            if (options.intersections === 1) {
                circleIntersections(ctx, circles, {
                    x: offsetx,
                    y: offsety
                }, size, true);
            } else if (options.intersections === 2) {
                circleIntersections(ctx, circles, {
                    x: offsetx,
                    y: offsety
                }, size, false);
            }
        }
    }
    ctx.restore();
}

function circleIntersections(ctx, circles, offset, size, remove) {
    var insideCount = 0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            circles.forEach(function(circle, e) {
                if (insideCircle(circle.centre, circle.size, {
                        x: i,
                        y: j
                    })) {
                    insideCount++;
                }
            });
            if (insideCount > 1 && remove) {
                ctx.beginPath();
                ctx.rect(i + offset.x, j + offset.y, 1, 1);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
            if (insideCount <= 1 && !remove) {
                ctx.beginPath();
                ctx.rect(i + offset.x, j + offset.y, 1, 1);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
            insideCount = 0;
        }
    }
}


function getCircle(centre, offset, size, color, options) {
    var point = closestCorner(centre, size);
    var width = Math.min(Math.abs(point.x * size - centre.x), Math.abs(point.y * size - centre.y));
    var sizeNorm = (options && options.relative) ? width * centre.normal : width;
    return {
        centre,
        size: sizeNorm,
        color: color
    };
}

function metaBalls(ctx, offsetx, offsety, coords, size, colors, options) {
    // console.log(typeof coords);
    var count = 0;
    ctx.save()
    ctx.globalCompositeOperation = "source-over";
    var balls = [];
    coords.forEach(function(elem, e) {
        //if(count++ === 0)
        if (options && options.relative)
            balls.push(getCircle(elem, {
                x: offsetx,
                y: offsety
            }, size, colors[e], {
                relative: true
            }));
        else
            balls.push(getCircle(elem, {
                x: offsetx,
                y: offsety
            }, size, colors[e]));
    });
    var pairs = pairCircles(balls);

    var influence = 0;
    var infMin = 10000000;
    var infMax = 0;
    for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
            if (options && options.pairs) {
                influence = 0;
                pairs.forEach(function(pair) {
                    if (pair.length > 1) {
                        pair.forEach(function(ball) {
                            influence += (balls[ball].size / (size)) / (Math.pow(x - balls[ball].centre.x, 2) + Math.pow(y - balls[ball].centre.y, 2));
                        });
                    } else {
                        influence += (balls[pair].size / (size)) / (Math.pow(x - balls[pair].centre.x, 2) + Math.pow(y - balls[pair].centre.y, 2));
                    }
                    var color;
                    // maxInf = sensitivity (centre size)
                    var fuzziness = 0.2;
                    var maxInf = 0.002;
                    var minInf = maxInf - (maxInf * fuzziness);
                    var opacity = (influence - minInf) / (maxInf - minInf);
                    opacity = (opacity > 1) ? 1 : opacity;
                    if (pair.length > 1) {
                        color = ctx.createLinearGradient(balls[pair[0]].centre.x + offsetx, balls[pair[0]].centre.y + offsety, balls[pair[1]].centre.x + offsetx, balls[pair[1]].centre.y + offsety);
                        color.addColorStop(0, balls[pair[0]].color.replace(/[^,]+(?=\))/, opacity));
                        color.addColorStop(1, balls[pair[1]].color.replace(/[^,]+(?=\))/, opacity));
                    } else {
                        color = balls[pair].color.replace(/[^,]+(?=\))/, opacity);
                    }

                    ctx.beginPath();
                    ctx.rect(x + offsetx, y + offsety, 1, 1);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.closePath();
                    influence = 0;
                });

            } else {
                influence = 0;
                balls.forEach(function(ball) {
                    influence += (ball.size / (size)) / (Math.pow(x - ball.centre.x, 2) + Math.pow(y - ball.centre.y, 2));
                });

                // maxInf = sensitivity (centre size)
                var fuzziness = 0.1;
                var maxInf = 0.002;
                var minInf = maxInf - (maxInf * fuzziness);
                var opacity = (influence - minInf) / (maxInf - minInf);

                opacity = (opacity > 1) ? 1 : opacity;

                var color = "rgba(0,0,0," + opacity + ")";

                ctx.beginPath();
                ctx.rect(x + offsetx, y + offsety, 1, 1);
                ctx.fillStyle = color;
                ctx.fill();
            }

        }
    }
}

function pairCircles(circles) {
    var pair = -1;
    var dist = 0;
    var min = 1000;
    var num = Math.floor(circles.length / 2);
    var rem = circles.length % 2;
    var pairs = [];
    var paired = [];
    var lengths = [];

    for (var i = 0; i < circles.length; i++) {
        for (var j = 0; j < circles.length; j++) {
            if (i != j) {
                lengths.push({
                    a: i,
                    b: j,
                    dist: Math.sqrt(
                        Math.pow(circles[i].centre.x - circles[j].centre.x, 2) +
                        Math.pow(circles[i].centre.y - circles[j].centre.y, 2))
                })
            }
        }
    }
    lengths.sort(function(a, b) {
        if (a.dist < b.dist) return -1;
        if (a.dist > b.dist) return 1;
        return 0;
    });

    for (var i = 0; i < lengths.length && num > 0; i++) {
        if (paired.indexOf(lengths[i].a) === -1 && paired.indexOf(lengths[i].b) === -1) {
            pairs.push([lengths[i].a, lengths[i].b]);
            paired.push(lengths[i].a);
            paired.push(lengths[i].b);
            num -= 1;
        }
    }
    if (rem === 1) {
        paired.sort();
        for (var i = 0; i < circles.length; i++) {
            if (paired.indexOf(i) === -1)
                pairs.push(i);
        }
    }
    return pairs;
}


function testingRemoval() {
    var a = [1, 2, 3, 4, 5, 6, 7, 8];
    var sel = -1;
    var pairs = [];
    var paired = [];
    for (var i = 0; i < a.length; i++) {

        if (paired.indexOf(i) !== -1) {
            continue;
        }
        for (var j = 0; j < a.length; j++) {
            if (paired.indexOf(j) !== -1) {
                continue;
            }
            if (i !== j) {
                if (Math.random() < 0.5) {
                    sel = j;
                }
            }
        }
        pairs.push({
            1: i,
            2: sel
        });
        paired.push(i);
        paired.push(sel);
    }
    return pairs;

}

function removeIntersections(ctx, rectangles, offset, size) {
    rectangles.forEach(function(elem, e) {
        for (var i = 0; i < rectangles.length; i++) {
            if (i !== e) {
                var intersection = {
                    x1: Math.max(elem.x, rectangles[i].x),
                    y1: Math.max(elem.y, rectangles[i].y),
                    x2: Math.min(elem.x + elem.w, rectangles[i].x + rectangles[i].w),
                    y2: Math.min(elem.y + elem.h, rectangles[i].y + rectangles[i].h)
                }
                if (intersection.x1 < intersection.x2 && intersection.y1 < intersection.y2) {
                    ctx.beginPath();
                    ctx.rect(intersection.x1 + offset.x, intersection.y1 + offset.y,
                        intersection.x2 - intersection.x1,
                        intersection.y2 - intersection.y1);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                }
            }
        }
    });
}


/**
 * keepIntersections - description
 *
 * @param  {type} ctx        description
 * @param  {type} rectangles description
 * @param  {type} offset     description
 * @param  {type} size       description
 * @return {type}            description
 */
function keepIntersections(ctx, rectangles, offset, size) {
    var intersections = [];
    rectangles.forEach(function(elem, e) {
        for (var i = 0; i < rectangles.length; i++) {
            if (i !== e) {
                var intersection = {
                    x1: Math.max(elem.x, rectangles[i].x),
                    y1: Math.max(elem.y, rectangles[i].y),
                    x2: Math.min(elem.x + elem.w, rectangles[i].x + rectangles[i].w),
                    y2: Math.min(elem.y + elem.h, rectangles[i].y + rectangles[i].h)
                }
                if (intersection.x1 < intersection.x2 && intersection.y1 < intersection.y2) {
                    var notThere = true;
                    intersections.forEach(function(elem) {
                        if (elem.x1 === intersection.x1 && elem.x2 === intersection.x2 &&
                            elem.y1 === intersection.y1 && elem.y2 === intersection.y2) {
                            notThere = false;
                        }
                    });
                    if (notThere)
                        intersections.push(intersection);
                }
            }
        }
    });
    var inside;
    for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
            inside = false;

            intersections.forEach(function(elem) {
                if ((x >= elem.x1 && x <= elem.x2) && (y >= elem.y1 && y <= elem.y2)) {
                    inside = true;
                }

            });
            if (!inside) {
                ctx.beginPath();
                ctx.rect(x + offset.x, y + offset.y, 1, 1);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
        }
    }
}


/**
 * get the values from inputs in the DOM with the class "values"
 */
function getValues() {
    var inputs = document.getElementsByClassName("value");
    for (var i = 0; i < inputs.length; i++) {
        settings.values[i].value = parseFloat(inputs[i].value);
    }
}

/**
 * Taken from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
String.prototype.hashCode = function() {
    var hash = 0,
        i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
 * Checks whether a given point is inside a circle described by a centre point and radius
 * @param {object} circleCentre The centre point of the circle (object with x and y properties {x: 10, y: 10})
 * @param {number} radius       The radius of the circle
 * @param {object} point        The point to check (object with x and y properties {x: 10, y: 10})
 * @return {boolean}            True or False depending on whether the point is within the circle
 */
function insideCircle(circleCentre, radius, point) {
    return eDist(circleCentre, point) <= radius;
}

/**
 * Find the Euclidean distance between two points
 * @param {object} point1       The first point (object with x and y properties {x: 10, y: 10})
 * @param {object} point2       The second point (object with x and y properties {x: 10, y: 10})
 * @return {number}             The Euclidean distance between the points
 */
function eDist(point1, point2) {
    var first = Math.pow((point1.x - point2.x), 2);
    var second = Math.pow((point1.y - point2.y), 2);
    return Math.sqrt(first + second);
}


function getGlyph(canvas, glyph, obj){
  var ctx = canvas.getContext("2d");
  loadDataPoints(obj);
  draw(ctx, glyph);
}
