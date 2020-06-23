/*
`adafruit_fancyled.adafruit_fancyled`
====================================================

FancyLED is a CircuitPython library to assist in creating buttery smooth LED animation.
It's loosely inspired by the FastLED library for Arduino, and in fact we have a "helper"
library using similar function names to assist with porting of existing Arduino FastLED
projects to CircuitPython.

* Author(s): PaintYourDragon*/

'use strict'

var GFACTOR, __repo__, __version__;
__version__ = "0.0.0-auto.0";
__repo__ = "https://github.com/Adafruit/Adafruit_CircuitPython_FancyLED.git";
class CRGB {
    /*Color stored in Red, Green, Blue color space.

    One of two ways: separate red, gren, blue values (either as integers
    (0 to 255 range) or floats (0.0 to 1.0 range), either type is
    'clamped' to valid range and stored internally in the normalized
    (float) format), OR can accept a CHSV color as input, which will be
    converted and stored in RGB format.

    Following statements are equivalent - all return red:

    .. code-block:: python

    c = CRGB(255, 0, 0)
    c = CRGB(1.0, 0.0, 0.0)
    c = CRGB(CHSV(0.0, 1.0, 1.0))
    */
    constructor(red, green = 0.0, blue = 0.0) {
        var b, frac, g, hsv, hue, invsat, r, sxt;
        if ((red instanceof CHSV)) {
            hsv = red;
            hue = (hsv.hue * 6.0);
            sxt = Math.floor(hue);
            frac = (hue - sxt);
            sxt = (Number.parseInt(sxt) % 6);
            if ((sxt === 0)) {
                [r, g, b] = [1.0, frac, 0.0];
            } else {
                if ((sxt === 1)) {
                    [r, g, b] = [(1.0 - frac), 1.0, 0.0];
                } else {
                    if ((sxt === 2)) {
                        [r, g, b] = [0.0, 1.0, frac];
                    } else {
                        if ((sxt === 3)) {
                            [r, g, b] = [0.0, (1.0 - frac), 1.0];
                        } else {
                            if ((sxt === 4)) {
                                [r, g, b] = [frac, 0.0, 1.0];
                            } else {
                                [r, g, b] = [1.0, 0.0, (1.0 - frac)];
                            }
                        }
                    }
                }
            }
            invsat = (1.0 - hsv.saturation);
            this.red = (((r * hsv.saturation) + invsat) * hsv.value);
            this.green = (((g * hsv.saturation) + invsat) * hsv.value);
            this.blue = (((b * hsv.saturation) + invsat) * hsv.value);
        } else {
            if ((((typeof red) === "number") || (red instanceof Number))) {
                this.red = clamp(red, 0.0, 1.0);
            } else {
                this.red = normalize(red);
            }
            if ((((typeof green) === "number") || (green instanceof Number))) {
                this.green = clamp(green, 0.0, 1.0);
            } else {
                this.green = normalize(green);
            }
            if ((((typeof blue) === "number") || (blue instanceof Number))) {
                this.blue = clamp(blue, 0.0, 1.0);
            } else {
                this.blue = normalize(blue);
            }
        }
    }
    __repr__() {
        return [this.red, this.green, this.blue];
    }
    toString() {
        return ([this.red, this.green, this.blue].join(", "));
    }
    get length() {
        /* Retrieve total number of color-parts available. */
        return 3;
    }
    __getitem__(key) {
        /* Retrieve red, green or blue value as iterable. */
        if ((key === 0)) {
            return this.red;
        }
        if ((key === 1)) {
            return this.green;
        }
        if ((key === 2)) {
            return this.blue;
        }
        throw IndexError;
    }
    pack() {
        /*'Pack' a `CRGB` color into a 24-bit RGB integer.

        :returns: 24-bit integer a la ``0x00RRGGBB``.
        */
        return (((denormalize(this.red) << 16) | (denormalize(this.green) << 8)) | denormalize(this.blue));
    }
}

class CHSV {
    /*Color stored in Hue, Saturation, Value color space.

    Accepts hue as float (any range) or integer (0-256 -> 0.0-1.0) with
    no clamping performed (hue can 'wrap around'), saturation and value
    as float (0.0 to 1.0) or integer (0 to 255), both are clamped and
    stored internally in the normalized (float) format.  Latter two are
    optional, can pass juse hue and saturation/value will default to 1.0.

    Unlike `CRGB` (which can take a `CHSV` as input), there's currently
    no equivalent RGB-to-HSV conversion, mostly because it's a bit like
    trying to reverse a hash...there may be multiple HSV solutions for a
    given RGB input.

    This might be OK as long as conversion precedence is documented,
    but otherwise (and maybe still) could cause confusion as certain
    HSV->RGB->HSV translations won't have the same input and output.
    */
    constructor(h, s = 1.0, v = 1.0) {
        if ((((typeof h) === "number") || (h instanceof Number))) {
            this.hue = h;
        } else {
            this.hue = (Number.parseFloat(h) / 256.0);
        }
        if ((((typeof s) === "number") || (s instanceof Number))) {
            this.saturation = clamp(s, 0.0, 1.0);
        } else {
            this.saturation = normalize(s);
        }
        if ((((typeof v) === "number") || (v instanceof Number))) {
            this.value = clamp(v, 0.0, 1.0);
        } else {
            this.value = normalize(v);
        }
    }
    __repr__() {
        return [this.hue, this.saturation, this.value];
    }
    toString() {
        return ("(%s, %s, %s)" % [this.hue, this.saturation, this.value]);
    }
    get length() {
        /* Retrieve total number of 'color-parts' available. */
        return 3;
    }
    __getitem__(key) {
        /* Retrieve hue, saturation or value as iterable. */
        if ((key === 0)) {
            return this.hue;
        }
        if ((key === 1)) {
            return this.saturation;
        }
        if ((key === 2)) {
            return this.value;
        }
        throw IndexError;
    }
    pack() {
        /*'Pack' a `CHSV` color into a 24-bit RGB integer.

        :returns: 24-bit integer a la ``0x00RRGGBB``.
        */
        return new CRGB(this).pack();
    }
}

function clamp(val, lower, upper) {
    /*Constrain value within a numeric range (inclusive).
    */
    return Math.max(lower, Math.min(val, upper));
}
function normalize(val, inplace = false) {
    /*Convert 8-bit (0 to 255) value to normalized (0.0 to 1.0) value.

    Accepts integer, 0 to 255 range (input is clamped) or a list or tuple
    of integers.  In list case, 'inplace' can be used to control whether
    the original list is modified (True) or a new list is generated and
    returned (False).

    Returns float, 0.0 to 1.0 range, or list of floats (or None if inplace).
    */
    var i;
    if ((((typeof val) === "number") || (val instanceof Number))) {
        return (clamp(val, 0, 255) / 255.0);
    }
    if (inplace) {
        i = 0;
        for (var n, _pj_c = 0, _pj_a = val, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
            n = _pj_a[_pj_c];
            val[i] = normalize(n);
            i += 1;
        }
        return null;
    }
    return function () {
        var _pj_a = [], _pj_b = val;
        for (var _pj_c = 0, _pj_d = _pj_b.length; (_pj_c < _pj_d); _pj_c += 1) {
            var n = _pj_b[_pj_c];
            _pj_a.push(normalize(n));
        }
        return _pj_a;
    }
        .call(this);
}
function denormalize(val, inplace = false) {
    /*Convert normalized (0.0 to 1.0) value to 8-bit (0 to 255) value

    Accepts float, 0.0 to 1.0 range or a list or tuple of floats.  In
    list case, 'inplace' can be used to control whether the original list
    is modified (True) or a new list is generated and returned (False).

    Returns integer, 0 to 255 range, or list of integers (or None if
    inplace).
    */
    var i;
    if ((((typeof val) === "number") || (val instanceof Number))) {
        return clamp(Number.parseInt((val * 256.0)), 0, 255);
    }
    if (inplace) {
        i = 0;
        for (var n, _pj_c = 0, _pj_a = val, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
            n = _pj_a[_pj_c];
            val[i] = denormalize(n);
            i += 1;
        }
        return null;
    }
    return function () {
        var _pj_a = [], _pj_b = val;
        for (var _pj_c = 0, _pj_d = _pj_b.length; (_pj_c < _pj_d); _pj_c += 1) {
            var n = _pj_b[_pj_c];
            _pj_a.push(denormalize(n));
        }
        return _pj_a;
    }
        .call(this);
}
function unpack(val) {
    /*'Unpack' a 24-bit color into a `CRGB` instance.

    :param int val:  24-bit integer a la ``0x00RRGGBB``.
    :returns: CRGB color.
    :rtype: CRGB
    */
    return new CRGB(((val & 16711680) / 16711680.0), ((val & 65280) / 65280.0), ((val & 255) / 255.0));
}
function mix(color1, color2, weight2 = 0.5) {
    /*Blend between two colors using given ratio. Accepts two colors (each
    may be `CRGB`, `CHSV` or packed integer), and weighting (0.0 to 1.0)
    of second color.

    :returns: `CRGB` color in most cases, `CHSV` if both inputs are `CHSV`.
    */
    var hue, sat, val, weight1;
    clamp(weight2, 0.0, 1.0);
    weight1 = (1.0 - weight2);
    if ((color1 instanceof CHSV)) {
        if ((color2 instanceof CHSV)) {
            hue = (color1.hue + ((color2.hue - color1.hue) * weight2));
            sat = ((color1.saturation * weight1) + (color2.saturation * weight2));
            val = ((color1.value * weight1) + (color2.value * weight2));
            return new CHSV(hue, sat, val);
        }
        color1 = new CRGB(color1);
        if ((((typeof color2) === "number") || (color2 instanceof Number))) {
            color2 = unpack(color2);
        }
    } else {
        if ((color2 instanceof CHSV)) {
            color2 = new CRGB(color2);
        } else {
            if ((((typeof color2) === "number") || (color2 instanceof Number))) {
                color2 = unpack(color2);
            }
        }
        if ((((typeof color1) === "number") || (color1 instanceof Number))) {
            color1 = unpack(color1);
        }
    }
    return new CRGB(((color1.red * weight1) + (color2.red * weight2)), ((color1.green * weight1) + (color2.green * weight2)), ((color1.blue * weight1) + (color2.blue * weight2)));
}
GFACTOR = 2.7;
function gamma_adjust(val, gamma_value = null, brightness = 1.0, inplace = false) {
    /*Provides gamma adjustment for single values, `CRGB` and `CHSV` types
    and lists of any of these.

    Works in one of three ways:
    1. Accepts a single normalized level (0.0 to 1.0) and optional
    gamma-adjustment factor (float usu. > 1.0, default if
    unspecified is GFACTOR) and brightness (float 0.0 to 1.0,
    default is 1.0). Returns a single normalized gamma-corrected
    brightness level (0.0 to 1.0).
    2. Accepts a single `CRGB` or `CHSV` type, optional single gamma
    factor OR a (R,G,B) gamma tuple (3 values usu. > 1.0), optional
    single brightness factor OR a (R,G,B) brightness tuple.  The
    input tuples are RGB even when a `CHSV` color is passed. Returns
    a normalized gamma-corrected `CRGB` type (NOT `CHSV`!).
    3. Accept a list or tuple of normalized levels, `CRGB` or `CHSV`
    types (and optional gamma and brightness levels or tuples
    applied to all). Returns a list of gamma-corrected values or
    `CRGB` types (NOT `CHSV`!).

    In cases 2 and 3, if the input is a list (NOT a tuple!), the 'inplace'
    flag determines whether a new tuple/list is calculated and returned,
    or the existing value is modified in-place.  By default this is
    'False'.  If you try to inplace-modify a tuple, an exception is raised.

    In cases 2 and 3, there is NO return value if 'inplace' is True --
    the original values are modified.
    */
    var brightness_blue, brightness_green, brightness_red, gamma_blue, gamma_green, gamma_red, i, newlist, x;
    if ((((typeof val) === "number") || (val instanceof Number))) {
        if ((gamma_value === null)) {
            gamma_value = GFACTOR;
        }
        return (Math.pow(val, gamma_value) * brightness);
    }
    if (((Array.isArray(val)) || (val instanceof Object))) {
        if ((((typeof val[0]) === "number") || (val[0] instanceof Number))) {
            if ((gamma_value === null)) {
                gamma_value = GFACTOR;
            }
            if (inplace) {
                i = 0;
                for (var x, _pj_c = 0, _pj_a = val, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
                    x = _pj_a[_pj_c];
                    val[i] = (Math.pow(val[i], gamma_value) * brightness);
                    i += 1;
                }
                return null;
            }
            newlist = [];
            for (var x, _pj_c = 0, _pj_a = val, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
                x = _pj_a[_pj_c];
                newlist.append((Math.pow(x, gamma_value) * brightness));
            }
            return newlist;
        }
        if ((gamma_value === null)) {
            [gamma_red, gamma_green, gamma_blue] = [GFACTOR, GFACTOR, GFACTOR];
        } else {
            if ((((typeof gamma_value) === "number") || (gamma_value instanceof Number))) {
                [gamma_red, gamma_green, gamma_blue] = [gamma_value, gamma_value, gamma_value];
            } else {
                [gamma_red, gamma_green, gamma_blue] = [gamma_value[0], gamma_value[1], gamma_value[2]];
            }
        }
        if ((((typeof brightness) === "number") || (brightness instanceof Number))) {
            [brightness_red, brightness_green, brightness_blue] = [brightness, brightness, brightness];
        } else {
            [brightness_red, brightness_green, brightness_blue] = [brightness[0], brightness[1], brightness[2]];
        }
        if (inplace) {
            i = 0;
            for (var x, _pj_c = 0, _pj_a = val, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
                x = _pj_a[_pj_c];
                if ((x instanceof CHSV)) {
                    x = new CRGB(x);
                }
                val[i] = new CRGB((Math.pow(x.red, gamma_red) * brightness_red), (Math.pow(x.green, gamma_green) * brightness_green), (Math.pow(x.blue, gamma_blue) * brightness_blue));
                i += 1;
            }
            return null;
        }
        newlist = [];
        for (var x, _pj_c = 0, _pj_a = val, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
            x = _pj_a[_pj_c];
            if ((x instanceof CHSV)) {
                x = new CRGB(x);
            }
            newlist.append(new CRGB((Math.pow(x.red, gamma_red) * brightness_red), (Math.pow(x.green, gamma_green) * brightness_green), (Math.pow(x.blue, gamma_blue) * brightness_blue)));
        }
        return newlist;
    }
    if ((gamma_value === null)) {
        [gamma_red, gamma_green, gamma_blue] = [GFACTOR, GFACTOR, GFACTOR];
    } else {
        if ((((typeof gamma_value) === "number") || (gamma_value instanceof Number))) {
            [gamma_red, gamma_green, gamma_blue] = [gamma_value, gamma_value, gamma_value];
        } else {
            [gamma_red, gamma_green, gamma_blue] = [gamma_value[0], gamma_value[1], gamma_value[2]];
        }
    }
    if ((((typeof brightness) === "number") || (brightness instanceof Number))) {
        [brightness_red, brightness_green, brightness_blue] = [brightness, brightness, brightness];
    } else {
        [brightness_red, brightness_green, brightness_blue] = [brightness[0], brightness[1], brightness[2]];
    }
    if ((val instanceof CHSV)) {
        val = new CRGB(val);
    }
    return new CRGB((Math.pow(val.red, gamma_red) * brightness_red), (Math.pow(val.green, gamma_green) * brightness_green), (Math.pow(val.blue, gamma_blue) * brightness_blue));
}
function palette_lookup(palette, position) {
    /*Fetch color from color palette, with interpolation.

    :param palette: color palette (list of CRGB, CHSV and/or packed integers)
    :param float position: palette position (0.0 to 1.0, wraps around).

    :returns: `CRGB` or `CHSV` instance, no gamma correction applied.
    */
    var color1, color2, idx, weight2;
    position %= 1.0;
    weight2 = (position * palette.length);
    idx = Number.parseInt(Math.floor(weight2));
    console.log(idx);
    weight2 -= idx;
    color1 = palette[idx];
    idx = ((idx + 1) % palette.length);
    color2 = palette[idx];
    // console.log(color1, color2, weight2);
    //return mix(color1, color2, weight2);
}
function expand_gradient(gradient, length) {
    /*Convert gradient palette into standard equal-interval palette.

    :param sequence gradient: List or tuple of of 2-element lists/tuples
    containing position (0.0 to 1.0) and color (packed int, CRGB or CHSV).
    It's OK if the list/tuple elements are either lists OR tuples, but
    don't mix and match lists and tuples -- use all one or the other.

    :returns: CRGB list, can be used with palette_lookup() function.
    */
    var above, below, color1, color2, least, most, n, newlist, pos, r, weight2, x;
    gradient = gradient.sort();//sorted(gradient);
    least = gradient[0][0];
    most = gradient.slice((- 1))[0][0];
    newlist = [];
    for (var i = 0, _pj_a = length; (i < _pj_a); i += 1) {
        pos = (i / Number.parseFloat((length - 1)));
        if ((pos <= least)) {
            [below, above] = [0, 0];
        } else {
            if ((pos >= most)) {
                [below, above] = [(- 1), (- 1)];
            } else {
                [below, above] = [0, (- 1)];
                n = 0;
                for (var x, _pj_d = 0, _pj_b = gradient, _pj_c = _pj_b.length; (_pj_d < _pj_c); _pj_d += 1) {
                    x = _pj_b[_pj_d];
                    if ((pos >= x[0])) {
                        below = n;
                    }
                    n += 1;
                }
                n = gradient.length;
                while ((n >= 0)) {
                    x = gradient[(n - 1)];
                    if ((pos <= x[0])) {
                        above = ((- 1) - n);
                    }
                    n -= 1;
                }
            }
        }
        r = (gradient[above][0] - gradient[below][0]);
        if ((r <= 0)) {
            newlist.append(gradient[below][1]);
        } else {
            weight2 = ((pos - gradient[below][0]) / r);
            color1 = gradient[below][1];
            color2 = gradient[above][1];
            newlist.append(mix(color1, color2, weight2));
        }
    }
    return newlist;
}

module.exports = {
    CRGB,
    CHSV,
    palette_lookup,
    gamma_adjust
};

//# sourceMappingURL=adafruit_fancyled.js.map
