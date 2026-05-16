import { TopBar } from "./top-bar";
import { MainNavbar } from "./main-navbar";

export async function StorefrontHeader() {
  return (
    <>
      <TopBar />

      <MainNavbar />
    </>
  );
}