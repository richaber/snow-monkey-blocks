import classnames from 'classnames';

import {
	InspectorControls,
	MediaPlaceholder,
	useBlockProps,
} from '@wordpress/block-editor';

import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { Icon, warning } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import ResponsiveTabPanel from '@smb/component/responsive-tab-panel';
import { toNumber } from '@smb/helper';

import useImageSizes from './use-image-sizes';

const ALLOWED_TYPES = [ 'image' ];
const DEFAULT_MEDIA_SIZE_SLUG = 'full';

export default function ( {
	attributes,
	setAttributes,
	className,
	isSelected,
	clientId,
} ) {
	const {
		images,
		sizeSlug,
		aspectRatio,
		arrows,
		dots,
		dotsToThumbnail,
		fade,
		shifted,
		gutter,
		displayCaption,
		interval,
		duration,
		lgSlidesToShow,
		mdSlidesToShow,
		smSlidesToShow,
	} = attributes;

	const hasImages = !! images.length;

	const { getSettings } = useSelect( ( select ) => {
		return {
			getSettings: select( 'core/block-editor' ).getSettings,
		};
	}, [] );

	const { resizedImages } = useSelect(
		( select ) => {
			return {
				resizedImages: images
					.map( ( image ) => {
						return image.id && isSelected
							? select( 'core' ).getMedia( image.id, {
									context: 'view',
							  } )
							: null;
					} )
					.filter( Boolean ),
			};
		},

		[ isSelected, images, clientId ]
	);

	const isAlignwide = 'wide' === attributes.align;
	const isAlignfull = 'full' === attributes.align;
	const isShiftable = ! fade;
	const isShifted = shifted && isShiftable && ( isAlignwide || isAlignfull );

	const ref = useRef();
	const referenceRef = useRef();
	const canvasRef = useRef();
	const useEffectDeps = !! ref.current && ref.current.offsetWidth;
	useEffect( () => {
		const width =
			!! ref.current &&
			!! canvasRef.current &&
			isShifted &&
			Math.floor( ref.current.offsetWidth );
		if ( !! width ) {
			ref.current.style.setProperty(
				'--spider-canvas-width',
				`${ width }px`
			);
			canvasRef.current.style.width = `${ width }px`;
		}

		const referenceWidth =
			!! referenceRef.current &&
			isShifted &&
			Math.floor( referenceRef.current.offsetWidth );
		if ( !! referenceWidth ) {
			ref.current.style.setProperty(
				'--spider-reference-width',
				`${ referenceWidth }px`
			);
		}
		// Temporarily disabling exhaustive-deps to avoid introducing unexpected side effecst.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ useEffectDeps ] );

	const classes = classnames( 'smb-spider-slider', className, {
		[ `smb-spider-slider--${ aspectRatio }` ]: !! aspectRatio,
		'smb-spider-slider--shifted': isShifted,
		[ `smb-spider-slider--gutter-${ gutter }` ]: !! gutter,
	} );

	const onSelectImages = ( selectedImages ) => {
		const newImages = selectedImages.map( ( image ) => {
			if ( ! image.id ) {
				return image;
			}

			const newSizeSlug = !! image?.sizes[ sizeSlug ]
				? sizeSlug
				: DEFAULT_MEDIA_SIZE_SLUG;
			const newUrl = image?.sizes[ newSizeSlug ]?.url;
			const newWidth = image?.sizes[ newSizeSlug ]?.width;
			const newHeight = image?.sizes[ newSizeSlug ]?.height;

			return {
				url: newUrl,
				alt: image.alt,
				id: image.id,
				width: newWidth,
				height: newHeight,
				caption: image.caption,
			};
		} );

		setAttributes( {
			images: newImages,
		} );
	};

	const onChangeSizeSlug = ( value ) => {
		const newImages = resizedImages.map( ( image ) => {
			if ( ! image.id ) {
				return image;
			}

			const newSizeSlug = !! image?.media_details?.sizes?.[ value ]
				? value
				: DEFAULT_MEDIA_SIZE_SLUG;
			const newUrl =
				image?.media_details?.sizes?.[ newSizeSlug ]?.source_url;
			const newWidth =
				image?.media_details?.sizes?.[ newSizeSlug ]?.width;
			const newHeight =
				image?.media_details?.sizes?.[ newSizeSlug ]?.height;

			return {
				url: newUrl,
				alt: image.alt,
				id: image.id,
				width: newWidth,
				height: newHeight,
				caption: image.caption.rendered,
			};
		} );

		setAttributes( {
			images: newImages,
			sizeSlug: value,
		} );
	};

	const sizeSlugOptions = useImageSizes(
		resizedImages,
		isSelected,
		getSettings
	);

	const aspectRatioOptions = [
		{
			value: '',
			label: __( 'Default', 'snow-monkey-blocks' ),
		},
		{
			value: '16x9',
			label: __( '16:9', 'snow-monkey-blocks' ),
		},
		{
			value: '4x3',
			label: __( '4:3', 'snow-monkey-blocks' ),
		},
	];

	const gutterOptions = [
		{
			value: '',
			label: __( 'None', 'snow-monkey-blocks' ),
		},
		{
			value: 's',
			label: __( 'S', 'snow-monkey-blocks' ),
		},
		{
			value: 'm',
			label: __( 'M', 'snow-monkey-blocks' ),
		},
		{
			value: 'l',
			label: __( 'L', 'snow-monkey-blocks' ),
		},
	];

	const onChangeAspectRatio = ( value ) =>
		setAttributes( {
			aspectRatio: value,
		} );

	const onChangeArrows = ( value ) =>
		setAttributes( {
			arrows: value,
		} );

	const onChangeDots = ( value ) =>
		setAttributes( {
			dots: value,
		} );

	const onChangeDotsToThumbnail = ( value ) =>
		setAttributes( {
			dotsToThumbnail: value,
		} );

	const onChangeFade = ( value ) =>
		setAttributes( {
			fade: value,
		} );

	const onChangeShifted = ( value ) =>
		setAttributes( {
			shifted: value,
		} );

	const onChangeGutter = ( value ) =>
		setAttributes( {
			gutter: value,
		} );

	const onChangeDisplayCaption = ( value ) =>
		setAttributes( {
			displayCaption: value,
		} );

	const onChangeInterval = ( value ) =>
		setAttributes( {
			interval: toNumber( value, 0, 10 ),
		} );

	const onChangeDuration = ( value ) =>
		setAttributes( {
			duration: toNumber( value, 0, 10 ),
		} );

	const onChangeLgSlidesToShow = ( value ) =>
		setAttributes( {
			lgSlidesToShow: toNumber( value, 1, 6 ),
		} );

	const onChangeMdSlidesToShow = ( value ) =>
		setAttributes( {
			mdSlidesToShow: toNumber( value, 1, 6 ),
		} );

	const onChangeSmSlidesToShow = ( value ) =>
		setAttributes( {
			smSlidesToShow: toNumber( value, 1, 6 ),
		} );

	const mediaPlaceholder = (
		<MediaPlaceholder
			addToGallery={ hasImages }
			isAppender={ hasImages }
			className={ className }
			disableMediaButtons={ hasImages && ! isSelected }
			icon={ ! hasImages && 'format-gallery' }
			labels={ {
				title: ! hasImages && __( 'Slider', 'snow-monkey-blocks' ),
				instructions:
					! hasImages &&
					__(
						'Drag images, upload new ones or select files from your library.',
						'snow-monkey-blocks'
					),
			} }
			onSelect={ onSelectImages }
			accept="image/*"
			allowedTypes={ ALLOWED_TYPES }
			multiple
			value={ images }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Dimensions', 'snow-monkey-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Block spacing', 'snow-monkey-blocks' ) }
						value={ gutter }
						onChange={ onChangeGutter }
						options={ gutterOptions }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Block settings', 'snow-monkey-blocks' ) }
				>
					<SelectControl
						label={ __( 'Images size', 'snow-monkey-blocks' ) }
						value={ sizeSlug }
						options={ sizeSlugOptions }
						onChange={ onChangeSizeSlug }
						help={ __( 'Select which image size to load.' ) }
					/>

					<SelectControl
						label={ __( 'Aspect ratio', 'snow-monkey-blocks' ) }
						value={ aspectRatio }
						onChange={ onChangeAspectRatio }
						options={ aspectRatioOptions }
					/>

					<ToggleControl
						label={ __( 'Display arrows', 'snow-monkey-blocks' ) }
						checked={ arrows }
						onChange={ onChangeArrows }
					/>

					<ToggleControl
						label={ __( 'Display dots', 'snow-monkey-blocks' ) }
						checked={ dots }
						onChange={ onChangeDots }
					/>

					{ dots && (
						<ToggleControl
							label={ __(
								'Change dots to thumbnails',
								'snow-monkey-blocks'
							) }
							checked={ dotsToThumbnail }
							onChange={ onChangeDotsToThumbnail }
						/>
					) }

					<ToggleControl
						label={ __( 'Fade', 'snow-monkey-blocks' ) }
						checked={ fade }
						onChange={ onChangeFade }
					/>

					{ isShiftable && (
						<ToggleControl
							label={ __(
								'Shifting the slider',
								'snow-monkey-blocks'
							) }
							help={
								shifted &&
								( ! isAlignfull || ! isAlignwide ) && (
									<>
										<Icon
											icon={ warning }
											style={ { fill: '#d94f4f' } }
										/>
										{ __(
											'It must be full width (.alignfull) or wide width (.alignwide).',
											'snow-monkey-blocks'
										) }
									</>
								)
							}
							checked={ shifted }
							onChange={ onChangeShifted }
						/>
					) }

					<ToggleControl
						label={ __( 'Display caption', 'snow-monkey-blocks' ) }
						checked={ displayCaption }
						onChange={ onChangeDisplayCaption }
					/>

					<RangeControl
						label={ __(
							'Autoplay Speed in seconds',
							'snow-monkey-blocks'
						) }
						help={ __(
							'If "0", no scroll.',
							'snow-monkey-blocks'
						) }
						value={ interval }
						onChange={ onChangeInterval }
						min="0"
						max="10"
					/>

					<RangeControl
						label={ __(
							'Animation speed in seconds',
							'snow-monkey-blocks'
						) }
						help={ __(
							'If "0", default animation speed.',
							'snow-monkey-blocks'
						) }
						value={ duration }
						onChange={ onChangeDuration }
						min="0"
						max="5"
						step="0.1"
					/>

					{ ! fade && (
						<ResponsiveTabPanel
							desktop={ () => (
								<RangeControl
									label={ __(
										'# of slides to show (Large window)',
										'snow-monkey-blocks'
									) }
									value={ lgSlidesToShow }
									onChange={ onChangeLgSlidesToShow }
									min="1"
									max={
										6 < images.length ? 6 : images.length
									}
								/>
							) }
							tablet={ () => (
								<RangeControl
									label={ __(
										'# of slides to show (Medium window)',
										'snow-monkey-blocks'
									) }
									value={ mdSlidesToShow }
									onChange={ onChangeMdSlidesToShow }
									min="1"
									max={
										6 < images.length ? 6 : images.length
									}
								/>
							) }
							mobile={ () => (
								<RangeControl
									label={ __(
										'# of slides to show (Small window)',
										'snow-monkey-blocks'
									) }
									value={ smSlidesToShow }
									onChange={ onChangeSmSlidesToShow }
									min="1"
									max={
										6 < images.length ? 6 : images.length
									}
								/>
							) }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			{ ! hasImages ? (
				<div { ...useBlockProps( { ref } ) }>{ mediaPlaceholder }</div>
			) : (
				<div
					{ ...useBlockProps( { className: classes, ref } ) }
					data-fade={ fade ? 'true' : 'false' }
					data-lg-slide-to-show={
						! fade && 1 < lgSlidesToShow
							? lgSlidesToShow
							: undefined
					}
					data-md-slide-to-show={
						! fade && 1 < mdSlidesToShow
							? mdSlidesToShow
							: undefined
					}
					data-sm-slide-to-show={
						! fade && 1 < smSlidesToShow
							? smSlidesToShow
							: undefined
					}
				>
					<div className="spider">
						{ isShifted && (
							<div className="c-container">
								<div
									className="spider__reference"
									ref={ referenceRef }
								/>
							</div>
						) }
						<div className="spider__canvas" ref={ canvasRef }>
							{ images.map( ( img, index ) => {
								return (
									<div
										className="spider__slide"
										data-id={ index }
										key={ index }
									>
										<div className="smb-spider-slider__figure-wrapper">
											<img
												className={ `spider__figure wp-image-${ img.id }` }
												src={ img.url }
												alt={ img.alt }
												width={
													img.width ||
													img.sizes?.full?.width
												}
												height={
													img.height ||
													img.sizes?.full?.height
												}
												data-image-id={ img.id }
											/>
										</div>

										{ displayCaption && !! img.caption && (
											<div className="smb-spider-slider__item">
												<div className="smb-spider-slider__item__caption">
													{ img.caption }
												</div>
											</div>
										) }
									</div>
								);
							} ) }
						</div>

						{ arrows && (
							<div className="spider__arrows">
								<button
									className="spider__arrow"
									data-direction="prev"
								>
									Prev
								</button>
								<button
									className="spider__arrow"
									data-direction="next"
								>
									Next
								</button>
							</div>
						) }
					</div>

					{ dots && (
						<div
							className="spider__dots"
							data-thumbnails={
								dotsToThumbnail ? 'true' : 'false'
							}
						>
							{ images.map( ( img, index ) => {
								return (
									<button
										className="spider__dot"
										data-id={ index }
										key={ index }
									>
										{ dotsToThumbnail ? (
											<img
												className={ `spider__figure wp-image-${ img.id }` }
												src={ img.url }
												alt={ img.alt }
												width={
													img.width ||
													img.sizes?.full?.width
												}
												height={
													img.height ||
													img.sizes?.full?.height
												}
											/>
										) : (
											<>{ index }</>
										) }
									</button>
								);
							} ) }
						</div>
					) }

					{ mediaPlaceholder }
				</div>
			) }
		</>
	);
}
