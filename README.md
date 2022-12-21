# Model Viewer (Except it's not really that good)

## How to install?
Within the repository, run ```npm i three``` in a terminal.
This should install the `three.js` package required to show any models.

### Usage
This model viewer was specifically designed for a browser source in OBS.

You can create a browser source and set the path to the system path to the `index.html` file. You can then use the **Interact** button to click on **Choose Model** and select your model.

## Supported File Types
| File Type | Does it work?? |
|-----:|---------------|
|`.ftl`|🚫|
|`.gkb`|🚫|
|`.glTF`|🚫|
|`.ply`|🚫|
|`.glb`|🚫|
|`.usd`|🚫|
|`.obj`|🤷|
|`.stl`|✅|
|`.png`|🚫|

----
This project was designed for @Nicant02

### To-do:
- Somehow fix `.obj` files.
- Colors
- Orientation