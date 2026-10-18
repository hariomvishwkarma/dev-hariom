# bibs-theme

This is a theme for BIBS.

## Installation

- Clone theme
- Install packages

## Install packages

```
npm install
```

Remember to go back to the project path.

## Run Locally

To watch parcel:

```
npm run watch
```

&

To run shopify cli:

```
npm run shopify --env=SHOPIFY_STORE_NAME
```

or

```
npm run dev
```

FX: SHOPIFY_STORE_NAME.myshopify.com

Commands can also be viewed in `package.json`

## Tailwind

- Docs: [Tailwindcss docs](https://tailwindcss.com/docs/configuration)
- Components: [Flowbite - Tailwind CSS component library](https://flowbite.com/docs/getting-started/introduction/)

## Linting

Install vs-code extensions

- [Shopify liquid](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Components

1.  #### Text (`c-text.liquid`)

    Component to render a text

    It can be rendered as `{% render "c-text" with custom_tag: 'p', content: "Hello World", classes: 'd-block text-align' %}`

    ### Parameters:

    - `content` { String }: The text to render
    - `variant` { String }: The variant of the text component to render
    - `classes` { String }: Additional classes to add to the component

2.  #### Video (`c-video.liquid`)

    Component to render a video.
    It takes one of `video` or `video_url` as required parameter.

    ### Parameters:

    - `video` {Object}: a video object
    - `video_url` {String}: a video url

    - `autoplay` {Boolean}: autoplay the video
    - `loop` {Boolean}: loop the video
    - `controls` {Boolean}: show controls

    - `aspect_ratio` {String}: the aspect ratio of the video

3.  #### Drawer (`c-drawer.liquid`)

    Component to render a drawer.

    ### Parameters:

    - `drawer_id` {String}[Required]: sets the id of the drawer
    - `drawer_placement` {String}[Default: 'right']: sets the placement of the drawer
    - `drawer_header` {String}: sets the header of the drawer
    - `drawer_content` {String}: sets the content of the drawer
    - `drawer_footer` {String}: sets the footer of the drawer
    - `drawer_backdrop` {Boolean}[Default: true]: sets the backdrop of the drawer
    - `toggle_label` {String}: sets the toggle label of the drawer

      Render the drawer with `toggle_label` parameter to render a drawer with a toggle button. If parameter `toggle_label` is missing, drawer component is created without the trigger button.

      To trigger a drawer with any of the already existing buttons, give it a attribute `data-drawer-target` with a value as id of the drawer. For example: `data-drawer-target="DRAWER_ID"`
