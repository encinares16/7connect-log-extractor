const regex = {
    "reference": /^\d{4}-\d{4}-\d{4}$/,
    "iso-incoming": /<isomsg direction="incoming">/g,
    "iso-packager": /<!-- org\.jpos\.iso\.packager\.XMLPackager -->/g,
    "iso-opening-tag": /<\/isomsg>/g,
    "iso-closing-tag": /<isomsg>/g,
    "log-closing-tag": /<\/log>/g,
}

export default regex