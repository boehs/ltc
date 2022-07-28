# Endpoints

Many of these are hidden

- /Home/GetLetter/\<id>
  - Get letter, even if it is hidden
    - I believe if the letter is hidden it will have a `letterLevel` of `-1`
- /Comment/GetComments/\<id>
  - Get comments for letter
    - Again, I believe letterlevel -1 is a hidden comment
- /api/get_letters/
  - -1/\<id>
    - normal letters (excluding hidden)
  - -10/\<id>
    - mod letters LOL