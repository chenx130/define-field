# Parse Query Example

This code example demonstrates how to parse query parameters from the URL using `ufo` library, define fields with descriptions and default values using `define-field` library, and then parse the query parameters based on the defined fields.

## Installation

Make sure you have Node.js installed. Then, install the required dependencies using npm or yarn:

```bash
npm install ufo define-field
```

# Usage
```javascript
import { parseQuery } from 'ufo';
import { parse, define, _string } from 'define-field';

// Parse query parameters from the URL
const query = parseQuery(location.search);

// Define fields with descriptions and default values
const fields = define({
  username: _string({
    description: 'Username',
  }),
  password: _string({
    description: 'Password',
  }),
  key: _string({
    description: 'Key',
    default: 'default key'
  }),
});

// Parse the query parameters based on the defined fields
const { parsedQuery, errors } = parse(query, fields);

console.log(parsedQuery); // {username: undefined, password: undefined, key: 'default key'}

```

# Explanation
 - `parseQuery(location.search)`: This function parses the query parameters from the current URL.
 - `define({...})`: This function defines fields with descriptions and default values.
 - `parse(query, fields)`: This function parses the query parameters using the defined fields and returns the parsed query parameters along with any errors encountered during parsing.
