# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Usage

1.) Create a configuration

```javascript
const config: WorkspaceLayoutConfiguration = {
    borderWidth_px: 1,
    controlBar_backgroundColor: "darkslategray",
    controlBarButton_color: "ghostwhite",
    tabButtonStyle: tabButtonStyle,
    tabButtonStyleHover: tabButtonStyleHover,
    minimizeLeftbarOnStart: true,
    minimizeBottombarOnStart: false
};
```

2.) Declare the content wrapped content at the top level of the document.
> Use a parentId of either "leftsidebar" or "bottomsidebar" depending on desired initial location.
> If more than one ContentWrapper share a parentId, the content in that parent will be tabbed.
> If no ContentWrapper is placed in either parentId, that parent will not be displayed.
```html
<ContentWrapper parentId="leftsidebar" name="CONTENT 2">
    <div slot="content">CONTENT 2</div>
</ContentWrapper>
```

3.) Declare the workspace layout component in the document.
```html
<WorkspaceLayout config={config}>
    <div slot="main-content">CONTENT</div>
</WorkspaceLayout>
```



