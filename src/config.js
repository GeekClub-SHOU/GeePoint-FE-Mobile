
const BACKEND_INFO_DEV = {
    ip:"10.1.1.164",
    port:"8360",
    prefix:'',

    get address(){
        return `http://${this.ip}:${this.port}/${this.prefix}`
    }
};
const BACKEND_INFO_PROD = {
    ip:"api.geepoint.coursego.cn",
    port:null,
    prefix:'',

    get address(){
        return `https://${this.ip}${this.port?":"+this.port:''}${this.prefix}`
    }
};
export const BACKEND_INFO = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? BACKEND_INFO_DEV:BACKEND_INFO_PROD;
