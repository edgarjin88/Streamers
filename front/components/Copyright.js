import Typography from "@material-ui/core/Typography";
import Link from "./CustomLinks";
import { memo } from "react";
const Copyright = memo(function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="#55c57a" href="#" text="Streamers.com"></Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
});
export default Copyright;
