import MapLoader from "./components/MapLoader";
import RidgeNav from "./components/RidgeNav";
import FlightHero from "./components/FlightHero";
import TrekArc from "./components/TrekArc";
import TheClimb from "./components/TheClimb";
import TripDetail from "./components/TripDetail";
import SeasonRing from "./components/SeasonRing";
import StayCards from "./components/StayCards";
import DepartureBoard from "./components/DepartureBoard";
import SunriseFooter from "./components/SunriseFooter";
import PlaneTravel from "./components/PlaneTravel";
import { ArtDefs, Seam } from "./components/bits";

/** Cairnline Treks · "Alpine Glass": Himalayan views under frosted glass, sections handed over through cloud seams. */
export default function Page() {
  return (
    <div className="ct-page">
      <ArtDefs />
      <MapLoader />
      <RidgeNav />
      <main>
        <FlightHero />
        <Seam k={0} tone="light" />
        <TrekArc />
        <Seam k={1} tone="dark" />
        <TheClimb />
        <Seam k={2} tone="dark" />
        <TripDetail />
        <Seam k={3} tone="dark" />
        <SeasonRing />
        <Seam k={4} tone="dark" />
        <StayCards />
        <Seam k={5} tone="dark" />
        <DepartureBoard />
        <Seam k={6} tone="dark" />
      </main>
      <SunriseFooter />
      <PlaneTravel />
      <div className="ct-skylight" aria-hidden />
    </div>
  );
}
