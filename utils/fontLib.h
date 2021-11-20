#ifndef __FONTLIB_H__
#define __FONTLIB_H__

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include <stdint.h>
#include "string.h"

/* Exported types ------------------------------------------------------------*/
typedef struct tFont
{
	const uint8_t* table;
	uint8_t Width;
	uint8_t Height;
}FONT_t;

