import { acceptFareResponse, createFareMessage, getMyFareMessage, listMyFareMessages } from "@/modules/flights/user/user.flight.controller";

export const userFlightRoutes = { listMyFareMessages, createFareMessage, getMyFareMessage, acceptFareResponse };
