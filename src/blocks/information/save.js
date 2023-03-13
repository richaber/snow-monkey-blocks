import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes, className } ) {
	const {
		labelAlign,
		labelVerticalAlign,
		smIsSplitColumn,
		columnPadding,
		labelColumnBackgroundColor,
		contentColumnBackgroundColor,
		borderColor,
		borderWidth,
	} = attributes;

	const classes = classnames( 'smb-information', className, {
		'smb-information--has-border': !! borderWidth,
	} );

	const styles = {
		'--smb-information--column-padding': !! columnPadding
			? `var(--smb-information--column-padding-${ columnPadding })`
			: undefined,
		'--smb-information--label-column-background-color':
			labelColumnBackgroundColor || undefined,
		'--smb-information--content-column-background-color':
			contentColumnBackgroundColor || undefined,
		'--smb-information--border-color': borderColor || undefined,
		'--smb-information--border-width': borderWidth || undefined,
	};

	return (
		<div
			{ ...useBlockProps.save( { className: classes, style: styles } ) }
			data-sm-split-column={ smIsSplitColumn ? 'true' : undefined }
			data-label-align={ labelAlign || 'left' }
			data-label-vertical-align={ labelVerticalAlign || 'top' }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					className: 'smb-information__body',
				} ) }
			/>
		</div>
	);
}
