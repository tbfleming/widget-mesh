/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
        Three: '//i2dcui.appspot.com/slingshot?url=http://threejs.org/build/three.min.js',
        ThreeSTLLoader: '//i2dcui.appspot.com/slingshot?url=http://threejs.org/examples/js/loaders/STLLoader.js',
        Clipper: '//i2dcui.appspot.com/js/clipper/clipper_unminified',
        WrapVirtualDom: '//i2dcui.appspot.com/slingshot?url=https://raw.githubusercontent.com/tbfleming/wrap-virtual-dom/master/wrap-virtual-dom.js',
        Poly2tri: '//i2dcui.appspot.com/slingshot?url=http://r3mi.github.io/poly2tri.js/dist/poly2tri.min.js',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
        ThreeSTLLoader: ['Three'],
    }
});

cprequire_test(["inline:org-jscut-widget-mesh"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:org-jscut-widget-mesh", ["Poly2tri", "chilipeppr_ready", "Three", "ThreeSTLLoader", "Clipper", "WrapVirtualDom"], function (poly2tri) {
    'use strict';
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "org-jscut-widget-mesh", // Make the id the same as the cpdefine id
        name: "Widget / Template", // The descriptive name of your widget.
        desc: "This example widget gives you a framework for creating your own widget. Please change this description once you fork this template and create your own widget. Make sure to run runme.js every time you are done editing your code so you can regenerate your README.md file, regenerate your auto-generated-widget.html, and automatically push your changes to Github.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function () {
            this.setupUiFromLocalStorage();
            this.forkSetup();
            this.initRenderBody();
            this.request3dObject();
            this.initMouse();
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondroppedTyped", this, this.onDroppedTyped);
            chilipeppr.subscribe("/org-jscut-widget-mesh/getWidget", callback => callback(this));
            chilipeppr.subscribe("/org-jscut-widget-mesh/addThreeMesh", this, this.addThreeMesh);
            chilipeppr.subscribe("/org-jscut-widget-mesh/removeMesh", this, this.removeMesh);
        },

        // Mesh object definition: {
        //      name:                           name
        //      threeMesh:                      THREE.Mesh
        //      types:                          1 or more of: '3d', '2d', 'image'
        //      /org-domain-widget-name/*:      Data that belongs to widget
        //      /org-domain-workspace-name/*:   Data that belongs to workspace
        // }
        meshes: [],

        // Find a Mesh object or a THREE.Mesh. Returns index into meshes[], or undefined
        getMeshIndex: function (mesh) {
            for (let i = 0; i < this.meshes.length; ++i)
                if (this.meshes[i] === mesh || this.meshes[i].threeMesh === mesh)
                    return i;
        },

        // Add a THREE.Mesh. Returns the new Mesh object.
        addThreeMesh: function (threeMesh, attrs) {
            let mesh = {
                name:       'unknown',
                threeMesh:  threeMesh,
                types:      ['3d'],
            };
            for (let key in attrs)
                mesh[key] = attrs[key];
            this.meshes.push(mesh);
            threeMesh.material.opacity = .5;
            threeMesh.material.transparent = true;
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/sceneadd', threeMesh);
            chilipeppr.publish('/org-jscut-widget-mesh/added', mesh, this.meshes);
            this.changed = true;
            return mesh;
        },

        // Remove a mesh. You may pass in either a Mesh object or a THREE.Mesh.
        removeMesh: function (mesh) {
            let i = this.getMeshIndex(mesh);
            if (i === undefined)
                return;
            mesh = this.meshes[i];
            if (mesh === this.highlightedMesh)
                this.highlightedMesh = null;
            this.meshes.splice(i, 1);
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/sceneremove', mesh.threeMesh);
            chilipeppr.publish('/org-jscut-widget-mesh/removed', mesh, this.meshes);
            this.changed = true;
        },

        highlightedMesh: null,

        highlightMesh: function (mesh) {
            if (mesh === this.highlightedMesh)
                return;
            if (this.highlightedMesh)
                this.highlightedMesh.threeMesh.material.transparent = true;
            this.highlightedMesh = mesh;
            if (this.highlightedMesh)
                this.highlightedMesh.threeMesh.material.transparent = false;
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/wakeanimate');
            this.changed = true;
        },

        pathsToPolyTree: function (paths) {
            let c = new ClipperLib.Clipper();
            c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
            let polyTree = new ClipperLib.PolyTree();
            c.Execute(ClipperLib.ClipType.ctUnion, polyTree, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
            return polyTree;
        },

        polyTreeToTriangles: function (polyNode, z, scale, result) {
            let pointToVertex = point => new THREE.Vector3(point.X / scale, point.Y / scale, z);
            let contourToVertexes = path => path.map(pointToVertex);
            let nodesToVertexes = nodes => nodes.map(node => contourToVertexes(node.Contour()));
            let processNode = node => {
                let vertexes = contourToVertexes(node.Contour());
                let holes = nodesToVertexes(node.Childs());
                let context = new poly2tri.SweepContext(vertexes);
                context.addHoles(holes);
                context.triangulate();
                let triangles = context.getTriangles();
                for(let t of triangles) {
                    let p = t.getPoints();
                    result.push(p[0], p[1], p[2]);
                }
                for(let hole of node.Childs()) {
                    for(let next of hole.Childs()) {
                        this.polyTreeToTriangles(next, z, scale, result);
                    }
                }
            };
            for(let node of polyNode.Childs()) {
                processNode(node);
            }
        },

        pathsToThreeMesh: function (paths, z, scale, materialParameters) {
            let polyTree = this.pathsToPolyTree(paths);
            let vertexes = [];
            this.polyTreeToTriangles(polyTree, z, scale, vertexes);

            let planeGeometry = new THREE.Geometry();
            planeGeometry.vertices = vertexes;
            for (let i = 0; i < vertexes.length; i += 3)
                planeGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
            planeGeometry.computeBoundingSphere();

            let planeMaterial = new THREE.MeshBasicMaterial(materialParameters);
            let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            return planeMesh;
        },

        wakeanimate: function () {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/wakeanimate');
        },

        // Render an icon button which floats right
        renderIconRightButton: function (className, onclick) {
            let h = WrapVirtualDom.h;
            return h('button', {
                style: { 'float': 'right' }, onclick: onclick
            }, h('span.glyphicon.' + className));
        },

        // Render mesh selection. Other widgets call this to help fill in their UI.
        renderMeshSelection: function (state, mesh, changedUI, callback) {
            let h = WrapVirtualDom.h;
            if (mesh) {
                return h('div', [
                    mesh.name,
                    this.renderIconRightButton('glyphicon-remove', () => {
                        if (this.selectCallback)
                            this.selectCallback(null);
                        this.selectCallback = null;
                        callback(null);
                    }),
                ]);
            } else if (state.selecting) {
                return h('div', {
                    style: { 'background-color': 'cyan' },
                    onclick: () => {
                        if (this.selectCallback)
                            this.selectCallback(null);
                        this.selectCallback = null;
                        state.selecting = false;
                        changedUI();
                    },
                }, [
                    'Click a mesh',
                    this.renderIconRightButton('glyphicon-stop'),
                ]);
            } else {
                return h('div', {
                    onclick: e => {
                        chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Prismatic", "Click on a Mesh");
                        if (this.selectCallback)
                            this.selectCallback(null);
                        state.selecting = true;
                        changedUI();
                        this.selectCallback = mesh => {
                            state.selecting = false;
                            changedUI();
                            callback(mesh);
                        };
                    }
                }, [
                    h('a', { href: '#' }, '<select>'),
                    this.renderIconRightButton('glyphicon-edit'),
                ]);
            }
        },

        // Render widget body
        renderBody: function () {
            let h = WrapVirtualDom.h;
            if (this.meshes.length === 0)
                return h('div', {}, 'Drag in an STL file to get started.');
            return h('table', { style: { width: '100%' } }, [
                h('colgroup', [
                    h('col'),
                    h('col', { style: { width: '100%' } }),
                    h('col'),
                ]),
                h('tr', h('th'), h('th', 'File')),
                this.meshes.map(mesh =>
                    h('tr', {
                        style: { 'background-color': mesh === this.highlightedMesh ? 'cyan' : 'transparent' },
                        onmousemove: e => { if (mesh.threeMesh.visible) this.highlightMesh(mesh) },
                    }, [
                        h('td', h('input', {
                            type: 'checkbox',
                            checked: mesh.threeMesh.visible,
                            onclick: e => { mesh.threeMesh.visible = e.target.checked; this.wakeanimate(); }
                        })),
                        h('td',
                            {
                                style: { 'user-select': 'none' },
                                onclick: () => {
                                    if (this.selectCallback) {
                                        this.selectCallback(mesh);
                                        this.selectCallback = null;
                                    }
                                }
                            },
                            mesh.name),
                        h('td', this.renderIconRightButton('glyphicon-remove', e => this.removeMesh(mesh))),
                    ])
                ),
            ]);
        },

        // Set this to true to eventually trigger a rerender
        changed: false,

        // Set up renderBody's render loop
        initRenderBody: function () {
            let body = document.getElementById('org-jscut-widget-mesh-body');
            body.removeChild(body.firstChild);
            let tree = this.renderBody();
            let rootNode = WrapVirtualDom.createElement(tree);
            body.appendChild(rootNode);

            let rerender = () => {
                if (this.changed) {
                    let newTree = this.renderBody();
                    let patches = WrapVirtualDom.diff(tree, newTree);
                    rootNode = WrapVirtualDom.patch(rootNode, patches);
                    tree = newTree;
                    this.changed = false;
                }
                requestAnimationFrame(rerender);
            };
            requestAnimationFrame(rerender);
        },

        request3dObject: function () {
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.recv3dObject);
            let f = () => {
                if (!this.widget3d) {
                    chilipeppr.publish('/com-chilipeppr-widget-3dviewer/request3dObject');
                    requestAnimationFrame(f);
                }
            };
            requestAnimationFrame(f);
        },

        recv3dObject: function (object, attrs) {
            this.camera = attrs.camera;
            this.widget3d = attrs.widget;
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.recv3dObject);
        },

        xyPlane: null,
        renderArea: null,
        mouseIsDown: false,
        mouseDownPoint: null,
        selectCallback: null,

        initMouse: function () {
            this.xyPlane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
                new THREE.MeshBasicMaterial({ visible: false }));
            this.renderArea = document.getElementById('com-chilipeppr-widget-3dviewer-renderArea');
            if (this.renderArea) {
                this.renderArea.addEventListener('mousedown', (e) => this.mousedown(e), true);
                this.renderArea.addEventListener('mousemove', (e) => this.mousemove(e), true);
                window.addEventListener('mousemove', (e) => this.mousemoveWindow(e), true);
                window.addEventListener('mouseup', (e) => this.mouseup(e), true);
            }
        },

        getRaycaster: function (e) {
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, this.camera);
            return raycaster;
        },

        getXYUnderMouse: function (e) {
            let io = this.getRaycaster(e).intersectObject(this.xyPlane);
            if (io.length)
                return io[0].point;
        },

        getMeshIndexUnderMouse: function (e) {
            if (!this.camera)
                return -1;
            let io = this.getRaycaster(e).intersectObjects(this.meshes.map(mesh => mesh.threeMesh));
            if (io.length)
                return this.getMeshIndex(io[0].object);
            return -1;
        },

        hightlightMeshUnderMouse: function (e) {
            if (this.widget3d && (this.widget3d.isInspectSelect || this.widget3d.isJogSelect))
                return false;
            let index = this.getMeshIndexUnderMouse(e);
            if (index < 0) {
                this.highlightMesh(null);
                return false;
            }
            this.highlightMesh(this.meshes[index]);
            return true;
        },

        mousedown: function (e) {
            this.mouseDownPoint = this.getXYUnderMouse(e);
            if (this.hightlightMeshUnderMouse(e) && this.mouseDownPoint) {
                if (this.selectCallback) {
                    this.selectCallback(this.highlightedMesh);
                    this.selectCallback = null;
                } else
                    this.mouseIsDown = true;
                e.preventDefault();
                e.stopPropagation();
            }
        },

        mousemove: function (e) {
            this.hightlightMeshUnderMouse(e);
        },

        mousemoveWindow: function (e) {
            if (!this.mouseIsDown)
                return;
            let p = this.getXYUnderMouse(e);
            if (p) {
                this.highlightedMesh.threeMesh.position.add(p).sub(this.mouseDownPoint);
                this.mouseDownPoint = p;
                chilipeppr.publish('/com-chilipeppr-widget-3dviewer/wakeanimate');
            }
            e.preventDefault();
            e.stopPropagation();
        },

        mouseup: function (e) {
            if (!this.mouseIsDown)
                return;
            this.mouseIsDown = false;
            e.preventDefault();
            e.stopPropagation();
        },

        onDroppedTyped: function (type, data, info) {
            if (type === 'stl')
                this.onDroppedStl(data, info);
            else if(type.startsWith('image/'))
                this.onDroppedImage(type, data, info);
        },

        onDroppedStl: function (data, info) {
            let loader = new THREE.STLLoader();
            let geometry = loader.parse(data);
            let material = new THREE.MeshPhongMaterial({ color: 0x007777, specular: 0x111111, shininess: 200 });
            let threeMesh = new THREE.Mesh(geometry, material);
            this.addThreeMesh(threeMesh, { name: info.name });
            return false;
        },

        onDroppedImage: function (type, data, info) {
            let loader = new THREE.TextureLoader();
            loader.load(window.URL.createObjectURL(new Blob([data], { type: type })), texture => {
                let threeMesh = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(100, 100, 1, 1),
                    new THREE.MeshBasicMaterial({ map: texture }));
                this.addThreeMesh(threeMesh, { name: info.name, types: ['2d', 'image'] });
            });
            return false;
        },

        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up more room since it's showing
            $(window).trigger("resize");
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up less room since it's hiding
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});