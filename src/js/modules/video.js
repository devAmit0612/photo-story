export default function Video({ps, moduleDefaults}) {

    moduleDefaults({
        video: {
            enable: true,
            autoplay: false,
            frame: 'SD'
        }
    });
    

    // extendModuleOptions({
    //     navigation: {
    //         next: '<svg class="next"></svg>',
    //         prev: '<svg class="prev"></svg>',
    //     }
    // });
    
}