declare module 'react-p5' {
    import * as p5 from 'p5';
    import * as React from 'react';

    export interface P5WrapperProps {
        sketch: (p: p5) => void;
    }

    export default class ReactP5Wrapper extends React.Component<P5WrapperProps> { }
}