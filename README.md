# staring at space, one day at a time.

a tiny website that pulls nasa's astronomy picture of the day and lets you scroll through decades of space photography. built with zero frameworks—just raw html, css, and js.

## screenshot

> add your screenshot here

![screenshot](screenshot.png)

## what's inside:

- browse any date back to june 1995 (the very first apod)
- random button for when you just want to discover something
- click any image to see it full screen
- save your favorites to a slide-out panel (they stay even if you refresh)
- smooth loading skeletons and a little starfield background

## try it out:

1. grab a free api key from api.nasa.gov

2. paste it in `script.js` where it says `PASTE_YOUR_KEY_HERE`

3. you can't just double-click `index.html` (browsers block fetch from `file://`). open it with vs code's live server, or run:

```bash
python -m http.server 8000
```

## why i built it:

wanted to learn how to consume apis in vanilla js without reaching for react. turns out you can make something that feels really smooth with just fetch, localStorage, and a few css animations.