import { __ } from '@wordpress/i18n';

import blockConfig from '@smb/config/block';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title:
		__( 'Thumbnail gallery', 'snow-monkey-blocks' ) +
		' ' +
		__( '(Deprecated)', 'snow-monkey-blocks' ),
	description:
		__(
			'You can display a slide show with thumbnails.',
			'snow-monkey-blocks'
		) +
		__(
			'This block is being retained for backwards compatibility and is not recommended for use. Its use may slow down the page display.',
			'snow-monkey-blocks'
		),
	icon: {
		foreground: blockConfig.blockIconColor,
		src: 'format-gallery',
	},
	edit,
	save,
	deprecated,
};
