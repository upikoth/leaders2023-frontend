;(() => {
  'use strict'
  let e,
    r = {
      40373: (e, r, n) => {
        n.d(r, {
          De: () => t,
          W$: () => a,
          mn: () => c,
          u_: () => i,
          yY: () => s
        })
        class t {
          constructor(e) {
            ;(this.description = e), Object.freeze(this)
          }
        }
        const o = new WeakMap()
        function a(e) {
          const r = new t(`lang:${e.meta.lang} apikey=${e.meta.apikey}`)
          return o.set(r, e), r
        }
        function s(e) {
          return e && o.get(e)
        }
        let i
        function c(e) {
          if (i) throw new Error('ymaps3: config is already set')
          i = e
        }
      },
      36519: (e, r, n) => {
        n.d(r, {
          Q: () => a
        })
        const t = n(40373)
        const o = {
          version: '',
          scaled: !0,
          hotspotZoomRange: {
            min: 0,
            max: 23
          }
        }
        function a(e, r = t.u_) {
          if (!e || !e.lang) throw new Error('Lang not specified')
          const { lang: n, signal: a } = e,
            s = (0, t.yY)(r)
          if (!s) throw new Error('Config not specified')
          const i = s.meta.apikey
          if (!i) throw new Error('Apikey must be specified in order to use fetchConfig')
          let c
          try {
            c = `${s.meta.hosts.apiConfigService}?${new URLSearchParams({
              lang: n,
              apikey: i
            })}`
          } catch (e) {
            return Promise.reject(e)
          }
          return fetch(c, {
            signal: a
          })
            .then((e) => e.json())
            .then((e) => {
              for (const r in e.layers)
                if (e.layers[r].hotspotZoomRange) {
                  const [n, t] = e.layers[r].hotspotZoomRange
                  e.layers[r].hotspotZoomRange = {
                    min: n,
                    max: t
                  }
                }
              return (
                e.layers.map || (e.layers.map = Object.assign({}, o)),
                (0, t.W$)(
                  Object.assign(Object.assign({}, s), {
                    meta: e
                  })
                )
              )
            })
        }
      },
      81119: (e, r, n) => {
        n.d(r, {
          N: () => s
        })
        const t = (0, n(30492).O)()
        let o,
          a = Promise.resolve()
        const s = function (e) {
          if (!s.A11__implCache[e]) {
            const r = s.loaders.slice()
            s.A11__implCache[e] = a.then(() => i(e, r, 0))
          }
          return s.A11__implCache[e]
        }
        function i(e, r, n) {
          if (n >= r.length) throw new Error('ymaps3: no loader for pkg ' + e)
          return Promise.resolve(r[n](e)).then(
            (t) => t || i(e, r, n + 1),
            () => i(e, r, n + 1)
          )
        }
        ;(s.FDB__implInit = (e, r) => {
          ;(o = e), (a = r)
        }),
          (s.A11__implCache = Object.create(null)),
          (s.A21__implInlineModules = Object.create(null))
        const c = RegExp('^(@yandex/ymaps3-)([^@]*)(?:@(\\d+\\.\\d+\\.\\d+))?$')
        function l(e, r, n) {
          return new Promise((t, o) => {
            const a = document.createElement(e)
            Object.assign(a, r),
              n && Object.assign(a.dataset, n),
              document.head.appendChild(a),
              (a.onload = t),
              (a.onerror = o)
          })
        }
        ;(s.default = function (e) {
          if (!o) return Promise.reject(new Error('ymaps3.import: not initialized'))
          if (s.A21__implInlineModules[e]) return s.A21__implInlineModules[e]()
          const r = c.exec(e)
          if (!r) return Promise.reject(new Error('Invalid package name format'))
          const n = r[1],
            a = r[2],
            i = r[3]
          if (
            !(
              ['controls-extra', 'editors', 'utils', 'vector'].includes(a) ||
              ([
                'cartesian-projection',
                'clusterer',
                'controls',
                'hint',
                'markers',
                'spherical-mercator-projection'
              ].includes(a) &&
                i)
            )
          )
            return Promise.reject(new Error('Unknown package name'))
          let m = o
          return (
            (m += i ? `/${i.replace(/\./g, '-')}` : ''),
            (m += `/${a}.js`),
            l('script', {
              src: m
            }).then(() => {
              const e = `${n}${a}`,
                r = t[e]
              return delete t[e], r
            })
          )
        }),
          (s.loaders = [s.default]),
          (s.script = function (e) {
            return l('script', {
              src: e
            })
          }),
          (s.cssText = function (e, r) {
            return l(
              'style',
              {
                textContent: e
              },
              {
                name: r || 'inline'
              }
            )
          }),
          (s.style = function (e) {
            return l('link', {
              rel: 'stylesheet',
              href: e
            })
          })
      },
      30492: (e, r, n) => {
        function t() {
          return 'undefined' != typeof globalThis ? globalThis : this || self
        }
        n.d(r, {
          O: () => t
        })
      }
    },
    n = {}
  function t(e) {
    const o = n[e]
    if (void 0 !== o) return o.exports
    const a = (n[e] = {
      id: e,
      exports: {}
    })
    return r[e](a, a.exports, t), a.exports
  }
  ;(t.m = r),
    (e = []),
    (t.O = (r, n, o, a) => {
      if (!n) {
        let s = 1 / 0
        for (m = 0; m < e.length; m++) {
          for (var [n, o, a] = e[m], i = !0, c = 0; c < n.length; c++)
            (!1 & a || s >= a) && Object.keys(t.O).every((e) => t.O[e](n[c]))
              ? n.splice(c--, 1)
              : ((i = !1), a < s && (s = a))
          if (i) {
            e.splice(m--, 1)
            const l = o()
            void 0 !== l && (r = l)
          }
        }
        return r
      }
      a = a || 0
      for (var m = e.length; m > 0 && e[m - 1][2] > a; m--) e[m] = e[m - 1]
      e[m] = [n, o, a]
    }),
    (t.n = (e) => {
      const r = e && e.__esModule ? () => e.default : () => e
      return (
        t.d(r, {
          a: r
        }),
        r
      )
    }),
    (t.d = (e, r) => {
      for (const n in r)
        t.o(r, n) &&
          !t.o(e, n) &&
          Object.defineProperty(e, n, {
            enumerable: !0,
            get: r[n]
          })
    }),
    (t.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
    (t.r = (e) => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, {
          value: 'Module'
        }),
        Object.defineProperty(e, '__esModule', {
          value: !0
        })
    }),
    (() => {
      t.b = document.baseURI || self.location.href
      const e = {
        668: 0
      }
      t.O.j = (r) => 0 === e[r]
      const r = (r, n) => {
          let o,
            a,
            [s, i, c] = n,
            l = 0
          if (s.some((r) => 0 !== e[r])) {
            for (o in i) t.o(i, o) && (t.m[o] = i[o])
            if (c) var m = c(t)
          }
          for (r && r(n); l < s.length; l++) (a = s[l]), t.o(e, a) && e[a] && e[a][0](), (e[a] = 0)
          return t.O(m)
        },
        n = (self.__chunk_yandex_ymaps3 = self.__chunk_yandex_ymaps3 || [])
      n.forEach(r.bind(null, 0)), (n.push = r.bind(null, n.push.bind(n)))
    })(),
    (t.nc = void 0)
  let o = {}
  ;(() => {
    t.r(o),
      t.d(o, {
        import: () => s.N,
        ready: () => d
      })
    const e = t(30492),
      r = t(36519),
      n = t(40373)
    const a = ['fetch', 'AbortController', 'URL', 'URLSearchParams', 'ResizeObserver']
    var s = t(81119)
    const i = (0, e.O)(),
      c = {
        meta: {
          lang: 'ru_RU',
          hosts: {
            apiCoverageService: 'https://api-maps.yandex.ru/services/coverage/',
            apiRouteService: 'https://api-maps.yandex.ru/services/route/',
            apiSearchService: 'https://api-maps.yandex.ru/services/search/',
            apiConfigService: 'https://api-maps.yandex.ru/3.0/config',
            mapTiles: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&%c&%l',
            mapjTiles:
              'https://core-renderer-tiles.maps.yandex.net/tiles?l=mapj&%c&%l&experimental_disable_toponym_hotspots=true',
            satTiles: 'https://core-sat.maps.yandex.net/tiles?l=sat&%c&%l',
            suggestApi: 'https://suggest-maps.yandex.ru/suggest-geo',
            vectorTiles:
              'https://core-renderer-tiles.maps.yandex.net/vmap2/tiles?lang={{lang}}&x={{x}}&y={{y}}&z={{z}}&zmin={{zmin}}&zmax={{zmax}}&v={{version}}',
            vectorImages:
              'https://core-renderer-tiles.maps.yandex.net/vmap2/icons?id={{id}}&scale={{scale}}',
            vectorMeshes: 'https://core-renderer-tiles.maps.yandex.net/vmap2/meshes?id={{id}}',
            vectorGlyphs:
              'https://core-renderer-tiles.maps.yandex.net/vmap2/glyphs?lang={{lang}}&font_id={{fontId}}&range={{range}}'
          },
          token: '1f64791d6de136eabc423b26ab2d2260',
          layers: {
            map: {
              version: '23.06.04-0',
              scaled: true,
              hotspotZoomRange: [1, 23]
            },
            skl: {
              version: '23.06.04-0',
              scaled: true,
              hotspotZoomRange: [1, 23]
            },
            sta: {
              version: '2023.06.06.15.45-1_23.06.06-0-14856',
              scaled: false
            },
            stv: {
              version: '2023.06.06.15.45-1_23.06.06-0-14856',
              scaled: false
            },
            sat: {
              version: '3.1075.0',
              scaled: false
            },
            trf: {
              version: '1686071220',
              scaled: true
            },
            trfe: {
              version: '',
              scaled: true,
              hotspotZoomRange: [0, 21]
            }
          },
          allowedFeatures: {
            vector: true,
            customization: false,
            router: false
          },
          geolocation: {
            lat: 55.753215,
            long: 37.622504,
            latSpan: 0.878654,
            longSpan: 1.164423
          },
          metrics: {
            allowSending: true,
            counterId: '80578111',
            pageUrl: 'api-maps.yandex.ru/3.0'
          },
          copyrights: {
            userAgreementHost: 'https://yandex.ru/legal/maps_termsofuse/?lang={{lang}}',
            userAgreementTextLong: 'Условия использования',
            userAgreementTextShort: 'Условия',
            logoLang: 'ru',
            allowRemove: false
          },
          ruler: {
            kmText: 'км',
            mText: 'м'
          },
          apikey: 'b1a170dc-a1e8-429e-b5a8-8260eaaf9ab5'
        },
        src: {
          base: 'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/3.0.11504041/build/static/bundles'
        }
      }
    if (i.ymaps3) throw new Error('ymaps3: already defined')
    !(function (e) {
      if (a.filter((r) => !e[r]).length)
        throw new Error(`ymaps3: next webapi's are required ${a.join(',')}`)
    })(i)
    const l = Promise.all([
      s.N.script(`${c.src.base}/main.js`),
      c.adhoc
        ? (0, r.Q)(
            c.adhoc.options,
            (0, n.W$)({
              meta: c.adhoc.meta
            })
          )
        : Promise.resolve(
            (0, n.W$)({
              meta: c.meta
            })
          )
    ]).then(([, e]) => {
      const r = '@yandex/ymaps3-main'
      Object.assign(i.ymaps3, i[r]), delete i[r], (0, n.mn)(e)
    })
    s.N.A21__implInlineModules['@yandex/ymaps3-reactify'] = () =>
      l.then(() => i.ymaps3.FD1__implReactify)
    const m =
        'loading' !== document.readyState
          ? Promise.resolve()
          : new Promise(function (e) {
              window.addEventListener('DOMContentLoaded', e)
            }),
      d = Promise.all([m, l]).then(() => i.ymaps3)
    s.N.FDB__implInit(c.src.base, d)
  })(),
    (o = t.O(o)),
    (self.ymaps3 = o)
})()
