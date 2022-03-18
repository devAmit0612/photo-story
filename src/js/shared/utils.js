const typeName = [
    'image',
    'video',
    'youtube',
    'vimeo',
    'dailymotion'
];

function checkPassiveListener() {
    let supportsPassive = false;
    try {
        let opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
            }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
    } catch (e) {}
    return supportsPassive;
}

function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
        try {
            object[key] = null;
        } catch (e) { }
        try {
            delete object[key];
        } catch (e) { }
    });
}

function extend(...args) {
    let obj = {};
    const options = Object(args[0]);
    const defaults = args[args.length - 1];

	obj = Object.assign(obj, ...args);
    for (let key in defaults) {
		if (key === 'gallery' && isObject(options[key])) {
            const gallery = {
                gallery: options[key]
            }
            Object.assign(defaults[key], gallery[key]);

		} else {
            if (isObject(defaults[key]) && isObject(options[key])) {
				Object.assign(defaults[key], options[key]);
			}
        }
	}
    return obj;
}

function getCurrentObj(list, el) {
    const currentObj = {};

    if (list && list.size) {
        Array.from(list.entries()).forEach(obj => {
            const key = obj[0];
            const values = obj[1];    
            if (values.indexOf(el) > -1) {
                currentObj['index'] = values.indexOf(el);
                currentObj['id'] = key;
            }
        });

    } else {
        const rel = el.getAttribute('rel');
        currentObj['index'] = 0;
        if (rel) {
            currentObj['id'] = rel;
        } else if (el.dataset.galleryId) {
            currentObj['id'] = el.dataset.galleryId;
        }
    }

    return currentObj;
}

function getFileType(value) {
    const imgReg = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
    const videoReg = /\.(mp4|mkv|wmv|m4v|mov|avi|flv|webm|flac|mka|m4a|aac|ogg)$/i;

    if (imgReg.test(value)) {
        return typeName[0];
    } else if (videoReg.test(value)) {
        return typeName[1];
    } else if (value.indexOf('youtu') > -1) {
        return typeName[2];
    } else if (value.indexOf('vimeo') > -1) {
        return typeName[3];
    } else if (value.indexOf('dailymotion') > -1) {
        return typeName[4];
    }
}

function getElement(obj) {
    if (isElement(obj)) { 
        return obj.jquery ? obj[0] : obj;
    }  
    if (typeof obj === 'string' && obj.length > 0) {
        return document.querySelectorAll(obj);
    }  
    return null
}

function getGallery(group) {
	const gallery = {};

	Array.from(group.entries()).forEach(obj => {
        const array = [];
        const key = obj[0];
        const values = obj[1];

        values.forEach(val => {
            const o = {
                main: val.getAttribute('href'),
                thumb: getThumb(val),
                title: getTitle(val),
                captions: val.dataset.psCaptions,
            };
            array.push(o);
        });

        gallery[key] = array;
	});

    return gallery;
}

function getGalleryGroup(el) {
    const group = groupBy(el, (element => {
        const rel = element.getAttribute('rel');
        if (rel && rel !== false && rel !== 'nofollow') {
            return rel;
        }
    }));

    return group;
}

function getGalleryType(obj) {
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const gallery = obj[key];
            Array.from(gallery).forEach(gal => {
                gal.type = getFileType(gal.main);
                if (!gal.thumb) {
                    gal.thumb = gal.main;
                }
            });
        }
    }

    return obj;
}

function getRel(el) {
    const rel = el.getAttribute('rel');
    if (rel && rel !== false && rel !== 'nofollow') {
        return rel;
    } else {
        return 'gallery';
    }
}

function getThumb(el) {
    let img = el.getElementsByTagName('img');
    
    if (img = isCollection(img)) {
        return img.getAttribute('src');
    } else if (typeof el.dataset.psThumb !== 'undefined') {
        return el.dataset.psThumb;
    } else {
        return el.getAttribute('href');
    }
}

function getTitle(el) {
    const title = el.getAttribute('title');
    if (title) {
        return title;
    } else if (typeof el.dataset.psTitle !== 'undefined') {
        return el.dataset.psTitle;
    }
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item) || getRel(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

function isElement(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }  
    if (typeof obj.jquery !== 'undefined') {
        obj = obj[0];
    }    
    return typeof obj.nodeType !== 'undefined'
}

function isObject(obj) {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj.constructor &&
        Object.prototype.toString.call(obj).slice(8, -1) === 'Object'
    );
}

function isCollection(collection) {
    if (collection instanceof HTMLCollection && HTMLCollection.prototype.isPrototypeOf(collection)) {
        return collection = collection[0];
    }
}


export {
    checkPassiveListener,
    deleteProps,
    extend,
    getCurrentObj,
    getElement,
    getGallery,
    getGalleryGroup,
    getGalleryType,
    isObject
};