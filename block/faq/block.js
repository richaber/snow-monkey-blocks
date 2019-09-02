'use strict';

import classnames from 'classnames';

import { blockConfig } from '../../src/js/config/block';
import { deprecated } from './_deprecated';

const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;
const { __ } = wp.i18n;

registerBlockType( 'snow-monkey-blocks/faq', {
	title: __( 'FAQ', 'snow-monkey-blocks' ),
	description: __( 'You can list the FAQs.', 'snow-monkey-blocks' ),
	icon: {
		foreground: blockConfig.blockIconColor,
		src: 'businessman',
	},
	category: blockConfig.blockCategories.common,
	snowMonkeyBlocks: {
		screenshot: `${ smb.pluginUrl }/dist/img/screenshot/block/faq.png`,
	},

	edit( { className } ) {
		const allowedBlocks = [ 'snow-monkey-blocks/faq--item' ];
		const template = [ [ 'snow-monkey-blocks/faq--item' ] ];

		const classes = classnames( 'smb-faq', className );

		return (
			<div className={ classes }>
				<div className="smb-faq__body">
					<InnerBlocks
						allowedBlocks={ allowedBlocks }
						template={ template }
						templateLock={ false }
					/>
				</div>
			</div>
		);
	},

	save( { className } ) {
		const classes = classnames( 'smb-faq', className );

		return (
			<div className={ classes }>
				<div className="smb-faq__body">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	deprecated: deprecated,
} );
