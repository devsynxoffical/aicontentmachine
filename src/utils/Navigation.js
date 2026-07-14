export function getEditRoute(type) {
  switch (type.toLowerCase()) {
    case "social post":
      return "/dashboard/social-posts";

    case "blog":
      return "/dashboard/blog";

    case "email":
      return "/dashboard/email";

    case "ad copy":
      return "/dashboard/ads";

    case "image":
      return "/dashboard/images";

    case "repurpose":
      return "/dashboard/repurpose";

    default:
      return "/dashboard";
  }
}