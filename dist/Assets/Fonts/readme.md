# Fonts Directory

All the fonts you use will go here.

Dont forget to add the following when using custom fonts either in separate css file or in the index.html enclosed in `<style></style>` tags.

```CSS
@font-face {
	font-family: fontname;
	src: url("font_filpath");
	font-weight: normal;
}

.fontLoader {
	position: absolute;
	left: -1000px;
	visibility: hidden;
}
```

and in the index.html

```HTML
<!-- If you have used separate style sheet-->
<link rel="stylesheet" href="stylesheet_filepath"/>

<body>
    <div class="fontLoader" style="font-family: pixelfont;"></div>
</body>

```
