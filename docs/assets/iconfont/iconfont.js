;(window._iconfont_svg_string_4877788 =
  '<svg><symbol id="icon-paixu" viewBox="0 0 1024 1024"><path d="M420.559974 72.98601l-54.855 0 0 774.336c-52.455014-69.163008-121.619046-123.762995-201.120051-157.052006l0 61.968c85.838029 41.401958 156.537958 111.337984 201.120051 198.221005l0 0.208 54.855 0 0-13.047c0.005018-0.00297 0.010035-0.005018 0.01495-0.007987-0.005018-0.010035-0.010035-0.019968-0.01495-0.030003L420.559974 72.986zM658.264986 73.385984l0-0.4L603.41 72.985984l0 877.68 54.855 0L658.265 176.524c52.457984 69.178982 121.632051 123.790029 201.149952 157.078016l0-61.961C773.560013 230.238003 702.853018 160.287027 658.264986 73.385984z"  ></path></symbol></svg>'),
  ((n) => {
    var t = (e = (e = document.getElementsByTagName('script'))[e.length - 1]).getAttribute(
        'data-injectcss',
      ),
      e = e.getAttribute('data-disable-injectsvg')
    if (!e) {
      var o,
        i,
        c,
        d,
        s,
        a = function (t, e) {
          e.parentNode.insertBefore(t, e)
        }
      if (t && !n.__iconfont__svg__cssinject__) {
        n.__iconfont__svg__cssinject__ = !0
        try {
          document.write(
            '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
          )
        } catch (t) {
          console && console.log(t)
        }
      }
      ;(o = function () {
        var t,
          e = document.createElement('div')
        ;(e.innerHTML = n._iconfont_svg_string_4877788),
          (e = e.getElementsByTagName('svg')[0]) &&
            (e.setAttribute('aria-hidden', 'true'),
            (e.style.position = 'absolute'),
            (e.style.width = 0),
            (e.style.height = 0),
            (e.style.overflow = 'hidden'),
            (e = e),
            (t = document.body).firstChild ? a(e, t.firstChild) : t.appendChild(e))
      }),
        document.addEventListener
          ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
            ? setTimeout(o, 0)
            : ((i = function () {
                document.removeEventListener('DOMContentLoaded', i, !1), o()
              }),
              document.addEventListener('DOMContentLoaded', i, !1))
          : document.attachEvent &&
            ((c = o),
            (d = n.document),
            (s = !1),
            r(),
            (d.onreadystatechange = function () {
              'complete' == d.readyState && ((d.onreadystatechange = null), l())
            }))
    }
    function l() {
      s || ((s = !0), c())
    }
    function r() {
      try {
        d.documentElement.doScroll('left')
      } catch (t) {
        return void setTimeout(r, 50)
      }
      l()
    }
  })(window)
