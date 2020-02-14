'use strict';

import classnames from 'classnames';

import { Fragment } from '@wordpress/element';

import blockAttributes from './attributes';

export default [
	{
		attributes: blockAttributes,
		supports: {
			align: [ 'wide', 'full' ],
		},

		save( { attributes, className } ) {
			const { imageID, imageURL, imageAlt } = attributes;

			const classes = classnames(
				'smb-thumbnail-gallery__item',
				className
			);

			return (
				<Fragment>
					{ !! imageID && (
						<div className={ classes }>
							<div className="smb-thumbnail-gallery__item__figure">
								<img
									src={ imageURL }
									alt={ imageAlt }
									className={ `wp-image-${ imageID }` }
								/>
							</div>
						</div>
					) }
				</Fragment>
			);
		},
	},
];
