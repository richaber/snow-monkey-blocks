'use strict';

import classnames from 'classnames';

import { blockConfig } from '../../../../src/js/config/block';
import { deprecated } from './_deprecated';
import { schema } from './_schema';

import { Figure } from '../../../../src/js/component/figure';

const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, PanelColorSettings, InnerBlocks, URLInput } = wp.editor;
const { PanelBody, BaseControl, SelectControl } = wp.components;
const { Fragment } = wp.element;
const { __ } = wp.i18n;

registerBlockType( 'snow-monkey-blocks/step--item', {
	title: __( 'Item', 'snow-monkey-blocks' ),
	description: __( 'It is a child block of the step block.', 'snow-monkey-blocks' ),
	icon: {
		foreground: blockConfig.blockIconColor,
		src: 'editor-ol',
	},
	category: blockConfig.blockCategories.common,
	parent: [ 'snow-monkey-blocks/step' ],
	attributes: schema,

	edit( { attributes, setAttributes, isSelected, className } ) {
		const { title, numberColor, imagePosition, imageID, imageURL, imageAlt, linkLabel, linkURL, linkTarget, linkColor } = attributes;

		const classes = classnames(
			'smb-step__item',
			`smb-step__item--image-${ imagePosition }`,
			className
		);

		const itemNumberStyles = {
			backgroundColor: numberColor || undefined,
		};

		const itemLinkStyles = {
			color: linkColor || undefined,
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Block Settings', 'snow-monkey-blocks' ) }>
						<SelectControl
							label={ __( 'Image Position', 'snow-monkey-blocks' ) }
							value={ imagePosition }
							options={ [
								{
									value: 'left',
									label: __( 'Left side', 'snow-monkey-blocks' ),
								},
								{
									value: 'center',
									label: __( 'Center', 'snow-monkey-blocks' ),
								},
								{
									value: 'right',
									label: __( 'Right side', 'snow-monkey-blocks' ),
								},
							] }
							onChange={ ( value ) => setAttributes( { imagePosition: value } ) }
						/>
					</PanelBody>

					<PanelBody title={ __( 'Link Settings', 'snow-monkey-blocks' ) }>
						<BaseControl label={ __( 'Link URL', 'snow-monkey-blocks' ) }>
							<URLInput
								value={ linkURL }
								onChange={ ( value ) => setAttributes( { linkURL: value } ) }
							/>
						</BaseControl>

						<SelectControl
							label={ __( 'Link Target', 'snow-monkey-blocks' ) }
							value={ linkTarget }
							options={ [
								{
									value: '_self',
									label: __( '_self', 'snow-monkey-blocks' ),
								},
								{
									value: '_blank',
									label: __( '_blank', 'snow-monkey-blocks' ),
								},
							] }
							onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
						/>
					</PanelBody>

					<PanelColorSettings
						title={ __( 'Color Settings', 'snow-monkey-blocks' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: numberColor,
								onChange: ( value ) => setAttributes( { numberColor: value } ),
								label: __( 'Number Color', 'snow-monkey-blocks' ),
							},
							{
								value: linkColor,
								onChange: ( value ) => setAttributes( { linkColor: value } ),
								label: __( 'Link Color', 'snow-monkey-blocks' ),
							},
						] }
					>
					</PanelColorSettings>
				</InspectorControls>

				<div className={ classes }>
					<div className="smb-step__item__title">
						<div className="smb-step__item__number" style={ itemNumberStyles }></div>
						<span>
							<RichText
								placeholder={ __( 'Write title...', 'snow-monkey-blocks' ) }
								value={ title }
								formattingControls={ [] }
								multiline={ false }
								onChange={ ( value ) => setAttributes( { title: value } ) }
							/>
						</span>
					</div>

					<div className="smb-step__item__body">
						{ ( !! imageID || isSelected ) &&
							<div className="smb-step__item__figure">
								<Figure
									url={ imageURL }
									id={ imageID }
									alt={ imageAlt }
									selectHandler={ ( media ) => {
										const newImageURL = !! media.sizes && !! media.sizes.large ? media.sizes.large.url : media.url;
										setAttributes( { imageURL: newImageURL, imageID: media.id, imageAlt: media.alt } );
									} }
									removeHandler={ () => setAttributes( { imageURL: '', imageAlt: '', imageID: 0 } ) }
									isSelected={ isSelected }
								/>
							</div>
						}

						<div className="smb-step__item__summary">
							<InnerBlocks />

							{ ( ! RichText.isEmpty( linkLabel ) || isSelected ) &&
								<span
									className="smb-step__item__link"
									href={ linkURL }
									style={ itemLinkStyles }
									target={ '_self' === linkTarget ? undefined : linkTarget }
									rel={ '_self' === linkTarget ? undefined : 'noopener noreferrer' }
								>
									<i className="fas fa-arrow-circle-right" />
									<RichText
										className="smb-step__item__link__label"
										placeholder={ __( 'Link text', 'snow-monkey-blocks' ) }
										value={ linkLabel }
										formattingControls={ [] }
										multiline={ false }
										onChange={ ( value ) => setAttributes( { linkLabel: value } ) }
									/>
								</span>
							}
						</div>
					</div>
				</div>
			</Fragment>
		);
	},

	save( { attributes, className } ) {
		const { title, numberColor, imagePosition, imageID, imageURL, imageAlt, linkLabel, linkURL, linkTarget, linkColor } = attributes;

		const classes = classnames(
			'smb-step__item',
			`smb-step__item--image-${ imagePosition }`,
			className
		);

		const itemNumberStyles = {
			backgroundColor: numberColor || undefined,
		};

		const itemLinkStyles = {
			color: linkColor || undefined,
		};

		return (
			<div className={ classes }>
				<div className="smb-step__item__title">
					<div className="smb-step__item__number" style={ itemNumberStyles }></div>
					<span>
						<RichText.Content value={ title } />
					</span>
				</div>

				<div className="smb-step__item__body">
					{ !! imageID &&
						<div className="smb-step__item__figure">
							<img src={ imageURL } alt={ imageAlt } className={ `wp-image-${ imageID }` } />
						</div>
					}

					<div className="smb-step__item__summary">
						<InnerBlocks.Content />

						{ ! RichText.isEmpty( linkLabel ) &&
							<a
								className="smb-step__item__link"
								href={ linkURL }
								style={ itemLinkStyles }
								target={ '_self' === linkTarget ? undefined : linkTarget }
								rel={ '_self' === linkTarget ? undefined : 'noopener noreferrer' }
							>
								<i className="fas fa-arrow-circle-right" />
								<span className="smb-step__item__link__label">
									<RichText.Content value={ linkLabel } />
								</span>
							</a>
						}
					</div>
				</div>
			</div>
		);
	},

	deprecated: deprecated,
} );
