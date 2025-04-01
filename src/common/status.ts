import {Visit, VisitStatus} from "@prisma/client";
import {AddressWithVisits, CoordinatesWithAddresses} from "~/types";

export const StatusNames: { [key: string]: string } = {
  [VisitStatus.u]: "Unassigned",
  [VisitStatus.a]: "Assigned",
  [VisitStatus.v]: "Visited/Doorhanger",
  [VisitStatus.f]: "Positive Interaction",
  [VisitStatus.fu]: "Followup",
  [VisitStatus.fc]: "Followup (Complete)",
  [VisitStatus.dnv]: "Do Not Visit",
  [VisitStatus.pr]: "Prayer Request",
};

export const StatusColors: { [key: string]: string } = {
  [VisitStatus.u]: "white",
  [VisitStatus.a]: "#dbdbdb",
  [VisitStatus.v]: "#0073b7",
  [VisitStatus.f]: "#a4bc39",
  [VisitStatus.fu]: "#f57c21",
  [VisitStatus.fc]: "#4aa841",
  [VisitStatus.dnv]: "#e54726",
  [VisitStatus.pr]: "#fdb823",
};

export const StatusDropdownOptions: { [key: string]: string } = {
  [VisitStatus.v]: "Visited/Doorhanger",
  [VisitStatus.f]: "Positive Interaction",
  [VisitStatus.fu]: "Followup",
  [VisitStatus.fc]: "Followup (Complete)",
  [VisitStatus.dnv]: "Do Not Visit",
  [VisitStatus.pr]: "Prayer Request",
};

export const getStatusColor = (visit: Visit | undefined) => {
  if (!visit) return StatusColors[VisitStatus.u]
  return StatusColors[visit.status]
}

export const getStatusColorFromCoordinate = (location: CoordinatesWithAddresses) => {
  const isApartment = location.addresses.length > 1

  if (isApartment) return '#8800e7';

  const status = location.addresses[0]?.status

  if (!status) {
    return StatusColors[VisitStatus.u]
  }

  return StatusColors[status]
}
