import coolerGLB from './cooler.glb';
import officeGLB from './office.glb';

const u = undefined;

const cooler = {
    model : coolerGLB,
    params : [100, 30, 100, 0.6]
}

const office = {
    model : officeGLB,
    params : [290, 10, -290, 58]
}

const models = {
    office : office,
}

export {models}