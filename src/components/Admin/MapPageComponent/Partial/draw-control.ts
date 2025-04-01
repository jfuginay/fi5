import { useControl } from "react-map-gl";
import React from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import type {MapRef, ControlPosition} from 'react-map-gl';
import {Feature, Polygon} from "@turf/turf";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
    position?: ControlPosition;

    onCreate?: (evt: {features: Feature<Polygon>[]}) => void;
    onUpdate?: (evt: {features: Feature<Polygon>[]; action: string}) => void;
    onDelete?: (evt: {features: Feature<Polygon>[]}) => void;
};

// eslint-disable-next-line react/display-name
export const DrawControl = React.forwardRef((props: DrawControlProps, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const drawRef = useControl<MapboxDraw>(
        () => new MapboxDraw(props),
        ({ map }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            map.on("draw.create", props.onCreate);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            map.on("draw.update", props.onUpdate);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            map.on("draw.delete", props.onDelete);
        },
        ({ map }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            map.off("draw.create", props.onCreate);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            map.off("draw.update", props.onUpdate);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            map.off("draw.delete", props.onDelete);
        },
        {
            position: props.position,
        }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    React.useImperativeHandle(ref, () => drawRef, [drawRef]); // This way I exposed drawRef outside the component

    return null;
});
