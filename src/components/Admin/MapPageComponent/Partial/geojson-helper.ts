import {Feature, FeatureCollection, Geometry} from "@turf/turf";
import {CoordinatesWithAddresses} from "~/types";
import {getStatusColorFromCoordinate} from "~/common/status";

export const getMarkerGeometry = (lon: number, lat: number): Geometry => {
    return { type: 'Point', coordinates: [lat, lon] };
}

export const getMarkerFeature = (marker: CoordinatesWithAddresses, icon: string, geometry: Geometry): Feature<Geometry> => {
    return {
        type: 'Feature',
        geometry: geometry,
        properties: {
            id: marker.id,
            icon,
            status: getStatusColorFromCoordinate(marker),
        }
    };
}

export const getMarkerFeatures = (marker: CoordinatesWithAddresses): Feature<Geometry>[] => {
    const features = []

    const icon = 'pending'
    const geometry = getMarkerGeometry(marker.latitude, marker.longitude);

    features.push(getMarkerFeature(marker, icon, geometry));

    return features
}

export const getMarkerFeatureCollection = (markers: CoordinatesWithAddresses[]): FeatureCollection<Geometry> => {
    const features: Feature<Geometry>[] = [];

    for (const marker of markers) {
        features.push(...getMarkerFeatures(marker));
    }

    return { type: 'FeatureCollection', features };
}

export const getMarkerGeojson = (markers: CoordinatesWithAddresses[]): any => {
    return { type: 'geojson', data: getMarkerFeatureCollection(markers), };
}
