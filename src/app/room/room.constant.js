angular.module('appModule.room').constant('RoomConstants', {

    settings: {
        newsCount: 50
    },

    viewPort: {
        name: "roomViewContainer"
    },

    dialogParams: {
        edit: {
            label: "label.assetHistory.reject",
            text: "message.common.confirm_reject",
            buttonOk: "button.common.ok",
            buttonCancel: "button.common.cancel",
            template: "assets/messagedialog/templates/custom.tpl.html",
            controller: "defaultModalDialogController"
        },
        delete: {
            label: "common.label.delete",
            text: "message.common.confirm_delete",
            buttonOk: "common.button.ok",
            buttonCancel: "common.button.cancel",
            controller: "defaultModalDialogController"
        },
        add: {
            template: "src/app/room/room-add-dialog.tpl.html",
            controller: "NewRoomDialogController",
            buttonCancel: "common.button.cancel",
            buttonOk: "common.button.ok",
            windowClass: "modal-dialog-content",
        }
    },

    messages: {
        missingData: "entities.rooms.error.missingData"
    },

    slickConfigUserRooms: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        touchMove: true,
        lazyLoad: 'ondemand',
        useTransform: true,
        arrows: false,
        autoplay: false,
        method: {}
    },
    slickConfigRooms: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        touchMove: true,
        lazyLoad: 'ondemand',
        useTransform: true,
        arrows: false,
        autoplay: false,
        method: {}
    },
    slickConfig: {
        slidesToShow: 6,
        slidesToScroll: 1,
        infinite: true,
        touchMove: true,
        lazyLoad: 'ondemand',
        useTransform: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,

        responsive: [
            {
                breakpoint: 1320,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    arrows: false,
                    mobileFirst: true
                }
            },
            {
                breakpoint: 885,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: false,
                    mobileFirst: true
                }
            },
            {
                breakpoint: 674,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                    mobileFirst: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    mobileFirst: true
                }
            }
        ]
    }
});
