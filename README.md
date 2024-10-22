# Edgeless Browser

<img src="./assets/Edgeless%20Logo.png" alt="Edgeless Browser" align="center" height="300" width="300" />

Edgeless Browser is a browser that is built on top of the electron framework and uses the solidjs library for the front end. The browser is a work in progress and is not yet ready for use. The browser is being built to be a more privacy focused browser that is secure and minimalistic. The browser is being built by Hasan and is open source so feel free to contribute to the project.

![App Screenshot](./screenshots/Screenshot_2024-09-30.png)

### getting started

to get started install the dependencies in both the app and electron directories

```bash
git clone https://github.com/edgelessbrowser/edgeless

# cd
cd edgeless

# installing app (solidjs) dependecies
cd app
yarn install

# Run the app in development mode
yarn dev
```

### Workspace Package Installation

To add a package to a specific workspace, you can use the following command:

```bash
yarn workspace <workspace_name> add <package_name>
```

For example, to add the `react-dom` package to the `app` workspace, run:

```bash
yarn workspace app add react-dom
```

> More information is coming soon.

Tweet at [@rakibtg](https://twitter.com/rakibtg)
