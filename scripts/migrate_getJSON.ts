function syndicationMigrate() {
  const data = {};
  const data2022 = {};
  const root = "resources/filecache/getjson";
  for (const f of Deno.readDirSync(root)) {
    const d = JSON.parse(Deno.readTextFileSync(`${root}/${f.name}`));
    if (!data[d.id_str]) {
      data[d.id_str] = d;
    } else {
      console.log(JSON.stringify(data[d.id_str], null, "\t"));
      console.log(JSON.stringify(d, null, "\t"));
    }
    data[d.id_str] = d;
  }
  const file = "data/tweet/syndication.json";
  Deno.writeTextFileSync(file, JSON.stringify(data, null, "\t"));
  // console.log(Object.keys(data).length, 'Syndication tweets Loaded');
  // append to data/*
}

syndicationMigrate();
