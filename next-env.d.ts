/// <reference types="next" />
/// <reference types="next/types/global" />
declare module '*.css';
declare module '*.scss';
declare module "*.glsl" {
    const value: string;
    export default value;
}
declare module "*.frag" {
    const value: string;
    export default value;
}
declare module "*.vert" {
    const value: string;
    export default value;
}