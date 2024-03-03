# demo-duckdb-react-cra

An example of using @jetblack/duckdb-react with create react app.

There are some differences between this demo and the vite demo.

The main difference is the treatment of wasm. It seams to be quite
difficult to use wasm in a CRA app without ejecting or using something
like [cracao](https://craco.js.org/). Because of this the DuckDB is
instantiated with the JsDelivr bundles. Similarly the shell uses the
wasm from JsDelivr.
