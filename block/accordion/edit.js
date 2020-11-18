import classnames from 'classnames';

import {
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

export default function ( { className } ) {
	const allowedBlocks = [ 'snow-monkey-blocks/accordion--item' ];
	const template = [ [ 'snow-monkey-blocks/accordion--item' ] ];

	const classes = classnames( 'smb-accordion', className );

	const blockProps = useBlockProps( {
		className: classes,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks,
		template,
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}
