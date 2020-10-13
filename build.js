const s = require("shelljs");

s.rm("-rf", "build");
s.rm("-rf", "reports");
s.mkdir("build");
s.mkdir("reports");
s.cp(`.app.env`, `build/.app.env`);
s.cp("-R", "public", "build/public");
s.mkdir("-p", "build/app/common/swagger");
s.cp("app/common/swagger/Api.yaml", "build/app/common/swagger/Api.yaml");
