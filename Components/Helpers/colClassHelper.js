/**
 * return column identifiers
 */

/* col letter */
export function returnColLetter(num) {
	switch (num) {
		case 0:
			return 'b';
		case 1:
			return 'i';
		case 2:
			return 'n';
		case 3:
			return 'g';
		case 4:
			return 'o';
	}
}

/* col class */
export function returnColClass(column) {
	switch (column) {
		case 'b':
		case 0:
			return 'numbers__circle--b';
		case 'i':
		case 1:
			return 'numbers__circle--i';
		case 'n':
		case 2:
			return 'numbers__circle--n';
		case 'g':
		case 3:
			return 'numbers__circle--g';
		case 'o':
		case 4:
			return 'numbers__circle--o';
	}
}
