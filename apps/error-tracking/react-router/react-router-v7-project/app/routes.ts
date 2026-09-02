import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("profile", "routes/profile.tsx"),
  route("stats", "routes/stats.tsx"),

  ...prefix("countries", [
    index("routes/countries.tsx"),
    route(":countryName", "routes/country.tsx"),
  ]),
] satisfies RouteConfig;
