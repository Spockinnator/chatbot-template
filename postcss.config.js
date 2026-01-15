// PostCSS configuration for CSS processing
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcssImport(),
    autoprefixer(),
    cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }]
    })
  ]
};
