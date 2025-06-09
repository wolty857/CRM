const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Punto de entrada de nuestra aplicación React
  output: {
    path: path.resolve(__dirname, 'dist'), // Carpeta de salida para los archivos empaquetados
    filename: 'bundle.js', // Nombre del archivo JavaScript empaquetado
    publicPath: '/dist/', // Ruta pública para acceder a los archivos
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Regla para archivos JavaScript y JSX
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Usar Babel para transpilar
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Regla para archivos CSS
        use: ['style-loader', 'css-loader'], // Usar style-loader y css-loader
      },
      // Puedes añadir reglas para imágenes, fuentes, etc. si es necesario
    ],
  },
  plugins: [
    // Este plugin genera un archivo HTML (opcional, ya tenemos index.php)
    // Pero es útil para el servidor de desarrollo de Webpack
    new HtmlWebpackPlugin({
      template: './index.php', // Usa nuestro index.php como plantilla
      filename: 'index.html', // Genera un index.html en la carpeta dist (para desarrollo)
      inject: 'body', // Inyecta los scripts en el body
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Servir archivos estáticos desde dist
    },
    compress: true,
    port: 3001, // Puerto cambiado a 3001
    // historyApiFallback: true, // Para manejar rutas de React Router (si lo usas después)
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Permite importar archivos .js y .jsx sin especificar la extensión
  },
};
