import {V} from 'working'

const dummy = {}

function send(root, message, p1, p2, p3, p4, p5, p6, p7, p8) {
    if (!root || !root.script) return false
    var instances = root.script || dummy
    var fn
    var result = false
    for (var i in instances) {
        var ins = instances[i]
        fn = ins[message];
        if (typeof fn == 'function') {
            fn.call(ins, p1, p2, p3, p4, p5, p6, p7, p8)
            result = true
        }
    }
    return result
}

function sendUpwards(root, p1, p2, p3, p4, p5, p6, p7, p8) {
    if (!root) return
    do {
        // if(!root.enabled) return;
        if (send.call(root, root, p1, p2, p3, p4, p5, p6, p7, p8)) return
        root =
            root.getParent ?
                root.getParent() :
                null;
    } while (root != null);
}

pc.Entity.prototype.getLossyScale = function () {
    let scale = V(this.getLocalScale())
    let scan = this.parent
    while (scan) {
        scale.mul(scan.getLocalScale())
        scan = scan.parent
    }
    return scale
}

function broadcast(root, p1, p2, p3, p4, p5, p6, p7, p8) {
    if (!root) return;
    let nodes = [];

    // let args = Array.prototype.slice.call(arguments)

    function retrieve(node) {
        if (!node || !(node instanceof pc.Entity)) return;
        nodes.push(node);
        var children = node.getChildren();
        for (var i = 0, len = children.length; i < len; i++) {
            if (children[i].enabled) retrieve(children[i]);
        }
    }

    retrieve(root);
    nodes.forEach(function (n) {
        root = n
        send.call(n, root, p1, p2, p3, p4, p5, p6, p7, p8);
    });
}

pc.Entity.prototype.send = function (message, p1, p2, p3, p4, p5, p6, p7, p8) {
    send(this, message, p1, p2, p3, p4, p5, p6, p7, p8)
}

pc.Entity.prototype.broadcast = function (message, p1, p2, p3, p4, p5, p6, p7, p8) {
    broadcast(this, message, p1, p2, p3, p4, p5, p6, p7, p8)
}

pc.Entity.prototype.sendUpwards = function (message, p1, p2, p3, p4, p5, p6, p7, p8) {
    sendUpwards(this, message, p1, p2, p3, p4, p5, p6, p7, p8)
}

export {send, sendUpwards, broadcast}
