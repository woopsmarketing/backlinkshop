module.exports = {
  plugins: {
    // @import 를 Tailwind 처리 전에 인라인한다 (styles/master.css 의 순서 보장).
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
