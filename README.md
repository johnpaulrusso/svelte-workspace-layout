## Developing 

Once you've cloned the project and installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Package Usage

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



