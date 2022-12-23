import classnames from 'classnames';

import {
	CheckboxControl,
	PanelBody,
	Popover,
	RangeControl,
	SelectControl,
	ToolbarButton,
} from '@wordpress/components';

import {
	BlockControls,
	ContrastChecker,
	InspectorControls,
	RichText,
	useBlockProps,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { link as linkIcon, linkOff as linkOffIcon } from '@wordpress/icons';
import LinkControl from '@smb/component/link-control';

// @todo For WordPress 6.0
import { useMultipleOriginColorsAndGradientsFallback } from '@smb/hooks';

// @todo For WordPress 6.0
if ( undefined === useMultipleOriginColorsAndGradients ) {
	useMultipleOriginColorsAndGradients =
		useMultipleOriginColorsAndGradientsFallback;
}

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	className,
} ) {
	const {
		lede,
		note,
		backgroundColor,
		btnLabel,
		btnURL,
		btnTarget,
		btnBackgroundColor,
		btnBackgroundGradientColor,
		btnTextColor,
		btnSize,
		btnBorderRadius,
		btnWrap,
	} = attributes;

	const [ isLinkUIOpen, setIsLinkUIOpen ] = useState( false );
	const urlIsSet = !! btnURL;
	const urlIsSetandSelected = urlIsSet && isSelected;
	const toggleLinkUI = () => setIsLinkUIOpen( ! isLinkUIOpen );
	const closeLinkUI = () => setIsLinkUIOpen( false );

	const classes = classnames( 'smb-btn-box', className );

	const btnClasses = classnames( 'smb-btn', {
		[ `smb-btn--${ btnSize }` ]: !! btnSize,
		'smb-btn--wrap': btnWrap,
	} );

	const styles = {
		'--smb-btn-box--background-color': backgroundColor || undefined,
	};

	const btnStyles = {
		'--smb-btn--background-color': btnBackgroundColor || undefined,
		'--smb-btn--background-image': btnBackgroundGradientColor || undefined,
		'--smb-btn--border-radius':
			!! btnBorderRadius || 0 <= btnBorderRadius
				? `${ btnBorderRadius }px`
				: undefined,
		'--smb-btn--color': btnTextColor || undefined,
	};
	if (
		!! attributes.className &&
		attributes.className.split( ' ' ).includes( 'is-style-ghost' )
	) {
		btnStyles[ '--smb-btn--style--ghost--border-color' ] =
			btnBackgroundColor || undefined;
	}

	const ref = useRef();

	const blockProps = useBlockProps( {
		className: classes,
		style: styles,
		ref,
	} );

	const onChangeBtnSize = ( value ) =>
		setAttributes( {
			btnSize: value,
		} );

	const onChangeBackgroundColor = ( value ) =>
		setAttributes( {
			backgroundColor: value,
		} );

	const onChangeBtnBackgroundColor = ( value ) =>
		setAttributes( {
			btnBackgroundColor: value,
		} );

	const onChangeBtnBackgroundGradientColor = ( value ) =>
		setAttributes( {
			btnBackgroundGradientColor: value,
		} );

	const onChangeBtnTextColor = ( value ) =>
		setAttributes( {
			btnTextColor: value,
		} );

	const onChangeLede = ( value ) =>
		setAttributes( {
			lede: value,
		} );

	const onChangeBtnLabel = ( value ) =>
		setAttributes( {
			btnLabel: value,
		} );

	const onChangeNote = ( value ) =>
		setAttributes( {
			note: value,
		} );

	const onChangeBtnUrl = ( { url: newUrl, opensInNewTab } ) => {
		setAttributes( {
			btnURL: newUrl,
			btnTarget: ! opensInNewTab ? '_self' : '_blank',
		} );
	};

	const onChangeBtnBorderRadius = ( value ) =>
		setAttributes( {
			btnBorderRadius: value,
		} );

	const onChangeBtnWrap = ( value ) =>
		setAttributes( {
			btnWrap: value,
		} );

	return (
		<>
			<InspectorControls>
				<PanelColorGradientSettings
					title={ __( 'Color', 'snow-monkey-blocks' ) }
					initialOpen={ false }
					settings={ [
						{
							colorValue: backgroundColor,
							onColorChange: onChangeBackgroundColor,
							label: __(
								'Background color',
								'snow-monkey-blocks'
							),
						},
					] }
					__experimentalHasMultipleOrigins={ true }
					__experimentalIsRenderedInSidebar={ true }
				></PanelColorGradientSettings>

				<PanelBody
					title={ __( 'Button settings', 'snow-monkey-blocks' ) }
				>
					<SelectControl
						label={ __( 'Button size', 'snow-monkey-blocks' ) }
						value={ btnSize }
						onChange={ onChangeBtnSize }
						options={ [
							{
								value: '',
								label: __(
									'Normal size',
									'snow-monkey-blocks'
								),
							},
							{
								value: 'little-wider',
								label: __(
									'Litle wider',
									'snow-monkey-blocks'
								),
							},
							{
								value: 'wider',
								label: __( 'Wider', 'snow-monkey-blocks' ),
							},
							{
								value: 'more-wider',
								label: __( 'More wider', 'snow-monkey-blocks' ),
							},
							{
								value: 'full',
								label: __( 'Full size', 'snow-monkey-blocks' ),
							},
						] }
					/>

					<RangeControl
						label={ __( 'Border radius', 'snow-monkey-blocks' ) }
						value={ btnBorderRadius }
						onChange={ onChangeBtnBorderRadius }
						min="0"
						max="50"
						initialPosition="6"
						allowReset
					/>

					<CheckboxControl
						label={ __( 'Wrap', 'snow-monkey-blocks' ) }
						checked={ btnWrap }
						onChange={ onChangeBtnWrap }
					/>

					<ColorGradientControl
						className="smb-inpanel-color-gradient-control"
						label={ __( 'Background color', 'snow-monkey-blocks' ) }
						colorValue={ btnBackgroundColor }
						onColorChange={ onChangeBtnBackgroundColor }
						gradientValue={ btnBackgroundGradientColor }
						onGradientChange={ onChangeBtnBackgroundGradientColor }
						{ ...useMultipleOriginColorsAndGradients() }
						__experimentalHasMultipleOrigins={ true }
						__experimentalIsRenderedInSidebar={ true }
					/>

					<ColorGradientControl
						className="smb-inpanel-color-gradient-control"
						label={ __( 'Text color', 'snow-monkey-blocks' ) }
						colorValue={ btnTextColor }
						onColorChange={ onChangeBtnTextColor }
						{ ...useMultipleOriginColorsAndGradients() }
						__experimentalHasMultipleOrigins={ true }
						__experimentalIsRenderedInSidebar={ true }
					/>

					<ContrastChecker
						backgroundColor={ btnBackgroundColor }
						textColor={ btnTextColor }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="c-container">
					{ ( ! RichText.isEmpty( lede ) || isSelected ) && (
						<RichText
							className="smb-btn-box__lede"
							value={ lede }
							onChange={ onChangeLede }
							placeholder={ __(
								'Write lede…',
								'snow-monkey-blocks'
							) }
						/>
					) }

					<div className="smb-btn-box__btn-wrapper">
						<span
							className={ btnClasses }
							href={ btnURL }
							style={ btnStyles }
							target={
								'_self' === btnTarget ? undefined : btnTarget
							}
							rel={
								'_self' === btnTarget
									? undefined
									: 'noopener noreferrer'
							}
						>
							<RichText
								className="smb-btn__label"
								value={ btnLabel }
								placeholder={ __(
									'Button',
									'snow-monkey-blocks'
								) }
								onChange={ onChangeBtnLabel }
								withoutInteractiveFormatting={ true }
							/>
						</span>
					</div>

					{ ( ! RichText.isEmpty( note ) || isSelected ) && (
						<RichText
							className="smb-btn-box__note"
							value={ note }
							onChange={ onChangeNote }
							placeholder={ __(
								'Write note…',
								'snow-monkey-blocks'
							) }
						/>
					) }
				</div>
			</div>

			<BlockControls group="block">
				{ ! urlIsSet && (
					<ToolbarButton
						icon={ linkIcon }
						label={ __( 'Link', 'snow-monkey-blocks' ) }
						aria-expanded={ isLinkUIOpen }
						onClick={ toggleLinkUI }
					/>
				) }
				{ urlIsSetandSelected && (
					<ToolbarButton
						isPressed
						icon={ linkOffIcon }
						label={ __( 'Unlink', 'snow-monkey-blocks' ) }
						onClick={ () => onChangeBtnUrl( '', false ) }
					/>
				) }
			</BlockControls>

			{ ( isLinkUIOpen || urlIsSetandSelected ) && (
				<Popover
					position="bottom center"
					anchorRef={ ref.current }
					onClose={ closeLinkUI }
				>
					<LinkControl
						url={ btnURL }
						target={ btnTarget }
						onChange={ onChangeBtnUrl }
					/>
				</Popover>
			) }
		</>
	);
}
