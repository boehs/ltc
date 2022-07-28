# ltc

An ambitious project. An project to archive one million *Letters To Crushes*.

> **#119507**: What other 16-year-old girl would ask her neighbors to borrow blankets so we could finish our fort?
> I love you more than endless Swedish Fish.

A website and more experimental media to present them

- [x] `/site`: a lightning fast website to browse the letters
- `/experiments`:
  - [x] `/discord-bot`: A frontend for discord, again, to browse letters
  - [ ] `/machine`: crap AI to write letters
- [x] `/analysis`: SQL, Sheets, And CSVs to analyze the letters

> **#668440**: I think you'd like some of the music I recently discovered. I don't know, I'm too shy to do anything but orchestrate(ha) coincidences.

**Please Note:** The dataset is *not* open source and there are *no plans* to open source it for the following reasons:

- Touchy copyright issues, like I don't own these letters, I don't have the right to open source them in any more significant way than what I have already done so
  - The authors of each letter released them expecting them to be read by a human one by one, *not* to be potentially abused automatically for evil
- Touchy ethical issues, I mean it's already dubious to be doing what I'm doing (misusing public apis), let alone exposing those intimate moments of 200k people to the internet, to be analyzed, warped.
  - To some degree I have already done this by open sourcing the archival scripts, but it would take many days to obtain this dataset
- The dataset contains many columns. For privacy and obvious reasons, I would need to:
  - Remove IP addrs
  - Shuffle ids

That being said, I am happy to explore this medium. Open a pull request with a SQL script, if it looks like it won't infringe on privacy I am happy to run it and upload the results as a CSV. I hope this will strike a happy medium. I am only looking for aggrate data.

- Open data
- NOT available for evils or privacy infringement