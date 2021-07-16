import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

// create an indexDB to cache downloaded file
const fileCache = localforage.createInstance({
	name: "fileCache",
});

export const fetchPlugin = (inputCode: string) => {
	return {
		name: "fetch-plugin",
		setup(build: esbuild.PluginBuild) {
			build.onLoad({ filter: /(^index\.js$)/ }, () => {
				return {
					loader: "jsx",
					contents: inputCode,
				};
			});

			build.onLoad({ filter: /.*/ }, async (args: any) => {
				//check to see if we have already fetched this package
				// and if it is in the cache
				const cashedResult = await fileCache.getItem<esbuild.OnLoadResult>(
					args.path
				);
				// if it is, return it immediately
				if (cashedResult) {
					return cashedResult;
				}
			});

			build.onLoad({ filter: /.css$/ }, async (args: any) => {
				const { data, request } = await axios.get(args.path);

				const escaped = data
					.replace(/\n/g, "")
					.replace(/"/g, '\\"')
					.replace(/'/g, "\\'");
				const contents = `
        const style = document.createElement('style')
        style.innerText = '${escaped}'
        document.head.appendChild(style)
        `;

				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents,
					resolveDir: new URL("./", request.responseURL).pathname,
				};
				//store response in cache
				await fileCache.setItem(args.path, result);

				return result;
			});

			build.onLoad({ filter: /.*/ }, async (args: any) => {
				const { data, request } = await axios.get(args.path);

				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: data,
					resolveDir: new URL("./", request.responseURL).pathname,
				};
				//store response in cache
				await fileCache.setItem(args.path, result);

				return result;
			});
		},
	};
};
